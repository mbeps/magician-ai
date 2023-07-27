import { UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "../sidebar/MobileSidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscriptions";

/**
 * Navbar component which displays the mobile sidebar and the user button.
 */
const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount(); // gets the number of free generations used
  const isPro = await checkSubscription(); // checks if the user is subscribed

  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
