import { Loader2 } from "lucide-react";

export const Spinner = ({ className }: { className?: string }) => {
    return (
      <div className={className}>
        <Loader2 className={cx("h-4 w-4 animate-spin")} />
      </div>
    );
  };