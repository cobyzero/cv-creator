import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border bg-white px-3.5 py-2 text-sm transition placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500",
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-800"
            : "border-zinc-200 dark:border-zinc-800",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
