import * as React from "react";
import { cn } from "@/lib/utils";
import { HiSearch } from "react-icons/hi";
import debounce from "lodash.debounce";

interface InputSearchProps extends React.ComponentProps<"input"> {
  delay?: number;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  ({ className, type, onChange, delay = 100, ...props }, ref) => {
    const debouncedLoadOptions = React.useMemo(
      () =>
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) onChange(event);
        }, delay),
      [delay, onChange]
    );

    return (
      <div className="flex flex-row relative">
        <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type={type}
          className={cn(
            "px-3 py-2 flex h-9 w-full rounded-md border border-gray-300 bg-transparent text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
            "pl-10"
          )}
          ref={ref}
          onChange={debouncedLoadOptions}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onChange) {
              event.stopPropagation();
              event.preventDefault(); // Mencegah submit form default jika ada
              onChange(event as any); // Panggil `onChange` langsung saat Enter ditekan
            }
          }}
          {...props}
        />
      </div>
    );
  }
);

InputSearch.displayName = "InputSearch";

export { InputSearch };
