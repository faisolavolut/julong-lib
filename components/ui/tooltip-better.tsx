import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export const TooltipBetter: FC<any> = ({ content, children }) => {
  if (content) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full flex flex-grow flex-row">{children}</div>
          </TooltipTrigger>
          <TooltipContent className="bg-linear-sidebar-active text-white  border border-primary shadow-md transition-all ">
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return children;
};
