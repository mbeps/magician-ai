import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscriptions";

/**
 * Loads the Replicate API key from the environment variables.
 */
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/**
 * POST /api/music
 * API route for music generation with Replicate's Riffusion model.
 * This can generate a single song from a prompt.
 * The API route is protected by Clerk and requires a valid session.
 * The prompt is required.
 * @param req (Request): The incoming request object which is the description of the song (JSON)
 * @returns (NextResponse): The response object which is the generated song (JSON)
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth(); // get the user ID from the session (Clerk)
    const body = await req.json(); // get the request body
    const { prompt } = body; // get the prompt from the request body

    // if the user ID is not valid, return an unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if the Replicate API key is not configured, return an internal error response
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
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

    // generate the response from Replicate
    const response = await replicate.run(
      // model used
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt, // prompt for the first song
        },
      }
    );

    // if the user is not on a pro subscription, increment the API limit
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response); // return the response from Replicate
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
