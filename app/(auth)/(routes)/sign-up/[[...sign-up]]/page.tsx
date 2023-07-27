import { SignUp } from "@clerk/nextjs";

//^ Name and route are specified in the documentation for Clerk

/**
 * Displays the sign up page.
 * The component rendered is from Clerk.
 * The route is specified in the documentation for Clerk.
 * @returns (JSX.Element): sign up page
 */
export default function Page() {
  return <SignUp />;
}
