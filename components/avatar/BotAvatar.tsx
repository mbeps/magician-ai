import { Avatar, AvatarImage } from "@/components/ui/avatar";

/**
 * Avatar for the AI.
 * This is used in the chatbot.
 * @returns (JSX.Element): bot avatar component
 */
export const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage className="p-1" src="/logo.png" />
    </Avatar>
  );
};
