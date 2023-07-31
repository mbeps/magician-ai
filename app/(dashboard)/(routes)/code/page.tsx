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
import { Code } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import * as z from "zod";
import { formSchema } from "./constants";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/useProModal";
import { getToolByLabel } from "@/actions/getToolByLabel";
import { Tool } from "@/constants/constants";

type CodeProps = {};

/**
 * Code page allows users to generate code.
 * It uses the OpenAI API to generate code from a prompt.
 * It returns a code snippet with explanation.
 * If the user is not subscribed and there are no remaining free tries, it will show a modal.
 */
const CodePage: React.FC<CodeProps> = () => {
  const proModal = useProModal(); // modal for non-subscribers
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]); // messages from the bot

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

  const tool: Tool | null = getToolByLabel("Code Generation");

  if (!tool) {
    return null;
  }

  const isLoading = form.formState.isSubmitting;

  /**
   * Submit the prompt to the API to generate code.
   * If the user is not subscribed and there are no remaining free tries, it will show a modal.
   * @param values (string) prompt for the code generation
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user", // user message
        content: values.prompt, // prompt for the code generation
      };
      const newMessages = [...messages, userMessage]; // add user message to the messages

      /**
       * Send the messages to the API to generate code.
       * Store the response in the messages.
       */
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      setMessages((current) => [...current, userMessage, response.data]); // add the response to the messages

      form.reset(); // clear input
    } catch (error: any) {
      // if the user is not subscribed and there are no remaining free tries, it will show a modal
      if (error.response.status === 403) {
        proModal.onOpen();
      } else {
        console.log(error);
        toast.error("Could not generate code");
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
                        placeholder="Write a Python function to calculate ... "
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
                  "p-8 w-full flex items-start gap-x-8 rounded-xl shadow-md",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodePage;
