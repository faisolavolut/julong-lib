import * as React from "react";

import { cn } from "@/lib/utils";
import { HiSearch } from "react-icons/hi";

const InputSearch = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div className="flex flex-row relative">
      <HiSearch
        className={cx(
          "absolute",
          css`
            top: 50%;
            left: 17px;
            transform: translate(-50%, -50%);
          `
        )}
      />
      <input
        type={type}
        className={cn(
          "px-3 py-2 flex h-9 w-full rounded-md border border-gray-300 border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          css`
            padding-left: 30px;
          `
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
InputSearch.displayName = "Input";

export { InputSearch };
