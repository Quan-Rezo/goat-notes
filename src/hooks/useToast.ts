"use client";

import { toast } from "sonner";

// Simple useToast hook that uses Sonner
export function useToast() {
  return {
    toast: {
      success: (message: string) => toast.success(message),
      error: (message: string) => toast.error(message),
      info: (message: string) => toast.info(message),
      warning: (message: string) => toast.warning(message),
      default: (message: string) => toast(message),
    },
  };
}

// Export the toast function directly for convenience
export { toast };
