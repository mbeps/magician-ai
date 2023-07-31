"use client";

import { Empty } from "@/components/empty/Empty";
import { Heading } from "@/components/heading/Heading";
import { Loader } from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Music } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { toast } from "react-hot-toast";
import { useProModal } from "@/hooks/useProModal";
import { getToolByLabel } from "@/actions/getToolByLabel";
import { Tool } from "@/constants/constants";

type MusicProps = {};

/**
 * Music page allows users to generate music from a prompt.
 * It uses the Replicate AI API to generate music from a prompt.
 * If the user is not subscribed and there are no remaining free tries, it will show a modal.
 * @returns (JSX.Element): Music page allows users to generate music.
 */
const MusicPage: React.FC<MusicProps> = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [music, setMusic] = useState<string>();

  /**
   * Form for the prompt for the music generation.
   * Zod used for validation.
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const tool: Tool | null = getToolByLabel("Music Generation");

  if (!tool) {
    return null;
  }

  const isLoading = form.formState.isSubmitting;

  console.log("music", tool);

  /**
   * Submit the prompt to the API to generate music.
   * If the user is not subscribed and there are no remaining free tries, it will show a modal.
   * @param values (string) prompt for the music generation
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined); // reset music

      const response = await axios.post("/api/music", values); // call API to generate music

      setMusic(response.data.audio); // store music
      form.reset(); // reset form to empty
    } catch (error: any) {
      // if the user is not subscribed and there are no remaining free tries, it will show a modal
      if (error.response.status === 403) {
        proModal.onOpen();
      } else {
        console.log(error);
        toast.error("Could not generate music");
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
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
              transition-all duration-200Adde
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
                      placeholder="Emotional piano soundtrack"
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
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!music && !isLoading && (
          <Empty label="No music has been generated yet" />
        )}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} />
          </audio>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
