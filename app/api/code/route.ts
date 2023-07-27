import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscriptions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

/**
 * Loads the OpenAI API key from the environment variables.
 */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration); // create an OpenAI API instance

/**
 * Custom prompt for the conversation model.
 * This specifies the model and instructions on how to present the data.
 */
const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

/**
 * POST /api/code
 * Uses the same OpenAI API as the conversation route but has a different prompt.
 * This allows it to be used for code generation.
 * The API route is protected by Clerk and requires a valid session.
 * The message is required.
 * The response is a JSON object with the generated text.
 * This API route is rate limited if there is no active subscription.
 * @param req (Request): The incoming request object which is the code description (JSON)
 * @returns (NextResponse): The response object (JSON)
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth(); // get the user ID from the session (Clerk)
    const body = await req.json(); // get the request body
    const { messages } = body; // get the messages from the request body

    // if the user ID is not valid, return an unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if the OpenAI API key is not configured, return an internal error response
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    // if the messages are not valid, return a bad request response
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit(); // check if the user is on a free trial
    const isPro = await checkSubscription(); // check if the user is on a pro subscription

    // if the user is not on a free trial and not on a pro subscription, return a forbidden response
    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    // generate the response from OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // the model to use
      messages: [instructionMessage, ...messages], // add the instruction message to the messages
    });

    // if the user is not on a pro subscription, increment the API limit
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response.data.choices[0].message); // return the response from OpenAI
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
