import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Photo prompt is required",
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

export const amountOptions = Array.from({ length: 5 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1} Photo${i > 0 ? "s" : ""}`,
}));

export const resolutionOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];
