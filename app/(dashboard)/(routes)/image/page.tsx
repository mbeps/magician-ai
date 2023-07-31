"use client";

import { Empty } from "@/components/empty/Empty";
import { Heading } from "@/components/heading/Heading";
import { Loader } from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useProModal } from "@/hooks/useProModal";
import { getToolByLabel } from "@/actions/getToolByLabel";
import { Tool } from "@/constants/constants";

type ImageProps = {};

/**
 * Page where users can generate images from a prompt.
 * It uses the OpenAI API to generate images from a prompt.
 * User can specify the amount of images to generate and the resolution.
 * If the user is not subscribed and there are no remaining free tries, it will show a modal.
 * @returns (JSX.Element): Image page allows users to generate images.
 */
const ImagePage: React.FC<ImageProps> = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [images, setImages] = useState<string[]>([]);

  /**
   * Form for the prompt for the image generation.
   * Zod used for validation.
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const tool: Tool | null = getToolByLabel("Image Generation");

  if (!tool) {
    return null;
  }

  /**
   * Submit the prompt to the API to generate images.
   * If the user is not subscribed and there are no remaining free tries, it will show a modal.
   * @param values (string) prompt for the image generation
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]); // empty the images array if there are any images from previous results

      const response = await axios.post("/api/image", values); // send the prompt to the API

      // get the urls of the generated images
      const urls: string[] = response.data.map(
        (image: { url: string }) => image.url
      );

      setImages(urls);
    } catch (error: any) {
      // if the user is not subscribed and there are no remaining free tries, it will show a modal
      if (error.response.status === 403) {
        proModal.onOpen();
      } else {
        console.log(error);
        toast.error("Could not generate image");
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
              transition-all duration-200
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="A picture of a horse in Swiss alps"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
        {images.length === 0 && !isLoading && (
          <Empty label="No images generated." />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {images.map((image) => (
            <Card key={image} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  fill
                  alt="Generated"
                  src={image}
                  className="rounded-lg"
                />
              </div>
              <CardFooter className="p-2">
                <Button
                  onClick={() => window.open(image)}
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ImagePage;
