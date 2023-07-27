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
 * POST /api/video
 * API route for video generation with Replicate's Zeroscope model.
 * This can generate a single video from a prompt.
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
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt, // description of the video
        },
      }
    );

    // if the user is not on a pro subscription, increment the API limit
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response); // return the response from Replicate
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
