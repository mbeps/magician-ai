import Image from "next/image";
import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="Logo" src="/logo.png" fill />
      </div>
      <p className="text-sm text-muted-foreground">
        The magician is working his magic...
      </p>
    </div>
  );
};
