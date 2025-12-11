"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "rgb(15 23 42)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
        },
      }}
    />
  );
}

