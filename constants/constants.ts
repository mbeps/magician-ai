import { Code, ImageIcon, MessageSquare, Music, VideoIcon } from "lucide-react";

export const MAX_FREE_COUNTS = 3;

export type Tool = {
  label: string;
  description: string;
  icon: any; // the actual type would depend on what your icon objects are
  href: string;
  color: string;
  bgColor: string;
};

export const tools: Tool[] = [
  {
    label: "Conversation",
    description: "Our most advanced conversation model",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Music Generation",
    description: "Generate music from your prompt",
    icon: Music,
    href: "/music",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Image Generation",
    description: "Turn your prompt into an image",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Video Generation",
    description: "Turn your prompt into video",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: "/video",
  },
  {
    label: "Code Generation",
    description: "Code generation from descriptions",
    icon: Code,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/code",
  },
];
