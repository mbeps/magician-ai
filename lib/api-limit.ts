import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants/constants";

/**
 * Increments the API limit for the current user.
 * This is used to track the number of API calls made by the user.
 * It is used to enforce the free trial.
 */
export const incrementApiLimit = async () => {
  const { userId } = auth(); // get the user ID from the session (Clerk)

  // if the user ID is not valid, return
  if (!userId) {
    return;
  }

  // get the current API limit for the user
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  // if the user has an API limit, increment the count
  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  }
  // if the user does not have an API limit, create one
  else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

/**
 * Checks if the user is on a free trial.
 * This is used to enforce the free trial.
 * @returns (boolean): Whether the user is on a free trial or not
 */
export const checkApiLimit = async () => {
  const { userId } = auth(); // get the user ID from the session (Clerk)

  // if the user ID is not valid, return false
  if (!userId) {
    return false;
  }

  // get the current API limit for the user
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  // if the user has an API limit and the count is less than the maximum free counts, return true
  return !userApiLimit || userApiLimit.count < MAX_FREE_COUNTS;
};

/**
 * Returns the current API limit for the user.
 * This is used to enforce the free trial and display the remaining API calls.
 * @returns (number): The current API limit for the user
 */
export const getApiLimitCount = async () => {
  const { userId } = auth(); // get the user ID from the session (Clerk)

  // if the user ID is not valid, return 0
  if (!userId) {
    return 0;
  }

  // get the current API limit for the user
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  // if the user has an API limit, return the count
  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count; // return the count
};
