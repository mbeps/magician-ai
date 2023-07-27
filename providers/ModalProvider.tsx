"use client";

import { ProModal } from "@/components/modals/ProModal";
import { useEffect, useState } from "react";

/**
 * This is a provider for the modal component.
 * It allows every component to use the modal without having to pass it down.
 * If the modal is not mounted then it will not be rendered.
 * @returns (JSX.Element): provider for modal
 */
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false); // by default not rendered

  // prevent hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ProModal />
    </>
  );
};
