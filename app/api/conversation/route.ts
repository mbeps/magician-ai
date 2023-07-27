import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscriptions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

/**
 * Loads the OpenAI API key from the environment variables.
 */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration); // create an OpenAI API instance

/**
 * POST /api/conversation
 * API route for conversations and text generation with OpenAI's GPT-3.5 model.
 * This is for generic conversations.
 * The API route is protected by Clerk and requires a valid session.
 * The message is required.
 * The response is a JSON object with the generated text.
 * This API route is rate limited if there is no active subscription.
 * @param req (Request): The incoming request object which is the message (JSON)
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
      messages, // the messages to model
    });

    // if the user is not on a pro subscription, increment the API limit
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response.data.choices[0].message); // response from OpenAI
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
