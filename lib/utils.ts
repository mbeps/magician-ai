import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Safely merges class names.
 * @param inputs (ClassValue[]: The class names to merge
 * @returns (string): The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the absolute URL for the app.
 * It gets the app URL from the environment variables.
 * Appends the relative path to the app URL.
 * @param path (string): The path to append to the app URL
 * @returns (string): The absolute URL (app URL + path)
 */
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
