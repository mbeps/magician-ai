import { SignIn } from "@clerk/nextjs";

//^ Name and route are specified in the documentation for Clerk

/**
 * Displays the sign in page.
 * The component rendered is from Clerk.
 * The route is specified in the documentation for Clerk.
 * @returns (JSX.Element): sign in page
 */
export default function Page() {
  return <SignIn />;
}
