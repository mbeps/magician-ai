"use client";

import { BotAvatar } from "@/components/avatar/BotAvatar";
import { UserAvatar } from "@/components/avatar/UserAvatar";
import { Empty } from "@/components/empty/Empty";
import { Heading } from "@/components/heading/Heading";
import { Loader } from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/useProModal";
import { getToolByLabel } from "@/actions/getToolByLabel";
import { Tool } from "@/constants/constants";

type ConversationProps = {};

/**
 * Code page allows users to have conversations and generate text.
 * It uses the OpenAI API to generate text from a prompt.
 * It returns a code snippet with explanation.
 * If the user is not subscribed and there are no remaining free tries, it will show a modal.
 */
const ConversationPage: React.FC<ConversationProps> = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  /**
   * Form for the prompt for the code generation.
   * Zod used for validation.
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const tool: Tool | null = getToolByLabel("Conversation");

  if (!tool) {
    return null;
  }

  const isLoading = form.formState.isSubmitting;

  /**
   * Submit the prompt to the API to generate a response.
   * If the user is not subscribed and there are no remaining free tries, it will show a modal.
   * @param values (string) prompt for the code generation
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      /**
       * Message to be sent to the API.
       * It contains the prompt and the role (user or bot).
       */
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      /**
       * Send the messages to the API.
       * Stores the response.
       */
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      setMessages((current) => [...current, userMessage, response.data]);

      form.reset(); // clear input
    } catch (error: any) {
      // if the user is not subscribed and there are no remaining free tries, it will show a modal
      if (error.response.status === 403) {
        proModal.onOpen();
      } else {
        console.log(error);
        toast.error("Could not answer your question");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title={tool!.label}
        description={tool!.description}
        icon={tool!.icon}
        iconColor={tool!.color}
        bgColor={tool!.bgColor}
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-xl 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-xl
                grid
                grid-cols-12
                gap-2
								shadow-lg
                transition-all duration-200
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-xl w-full flex items-center justify-center bg-muted shadow-md">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-xl shadow-xl",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConversationPage;
