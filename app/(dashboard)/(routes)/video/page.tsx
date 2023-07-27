"use client";

import { Empty } from "@/components/empty/Empty";
import { Heading } from "@/components/heading/Heading";
import { Loader } from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProModal } from "@/hooks/useProModal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import toast from "react-hot-toast";

type VideoProps = {};

/**
 * Video page allows users to generate video from a prompt.
 * It uses the Replicate AI API to generate video from a prompt.
 * If the user is not subscribed and there are no remaining free tries, it will show a modal.
 */
const VideoPage: React.FC<VideoProps> = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [video, setVideo] = useState<string>();

  /**
   * Form for the prompt for the video generation.
   * Zod used for validation.
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  /**
   * Submit the prompt to the API to generate video.
   * If the user is not subscribed and there are no remaining free tries, it will show a modal.
   * @param values (string) prompt for the video generation
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined); // reset video

      const response = await axios.post("/api/video", values); // call API to generate video

      setVideo(response.data[0]); // store video
      form.reset(); // reset form to empty
    } catch (error: any) {
      // if the user is not subscribed and there are no remaining free tries, it will show a modal
      if (error.response.status === 403) {
        proModal.onOpen();
      } else {
        console.log(error);
        toast.error("Could not generate video");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your prompt into video."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
              focus-within:shadow-sm
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
                      placeholder="Clown fish flying"
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
        {!video && !isLoading && <Empty label="No video files generated." />}
        {video && (
          <video
            controls
            className="w-full aspect-video mt-8 rounded-xl border bg-black shadow-lg"
          >
            <source src={video} />
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
