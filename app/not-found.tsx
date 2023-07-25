"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tools } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * This route is protected and is not accessible while user is not authenticated.
 */
export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="bg-neutral-900 h-full">
      <div className="mb-8 space-y-6 p-16">
        <h2 className="text-2xl text-neutral-200 md:text-4xl font-bold text-center">
          404: The page does not exist
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Use the links bellow to see some magic
        </p>
        <div className="mt-6 flex justify-center items-center">
          <Link href={"/"}>
            <Button variant="outline" className="rounded-xl ">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
