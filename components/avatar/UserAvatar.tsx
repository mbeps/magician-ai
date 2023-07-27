import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Avatar component that displays the user's avatar.
 * If the user does not have an avatar, it will display their initials.
 * @returns (JSX.Element): user avatar component
 */
export const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.profileImageUrl} />
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
