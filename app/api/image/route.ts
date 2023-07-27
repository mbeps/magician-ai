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
 * POST /api/image
 * API route for image generation with OpenAI's DALL-E model.
 * This can generate a single image or multiple images.
 * The images are of specified resolutions.
 * The API route is protected by Clerk and requires a valid session.
 * The prompt, amount, and resolution are required.
 * @param req (Request): The incoming request object
 * @returns (NextResponse): The response object (JSON)
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth(); // get the user ID from the session (Clerk)
    const body = await req.json(); // get the request body
    // get the prompt, amount, and resolution from the request body, defaulting to 1 and 512x512
    const { prompt, amount = 1, resolution = "512x512" } = body;

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

    // if the prompt is not valid, return a bad request response
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // if the amount of images is not valid, return a bad request response
    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    // if the resolution for images is not valid, return a bad request response
    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
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

    // generate the images with the prompt, amount, and resolution
    const response = await openai.createImage({
      prompt, // description of the image
      n: parseInt(amount, 10), // amount of images to generate
      size: resolution, // resolution of the images
    });

    // if the user is not on a pro subscription, increment the API limit
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response.data.data); // return the response data
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
