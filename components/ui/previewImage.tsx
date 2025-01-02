import { FC } from "react";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export const PreviewImagePopup: FC<any> = ({ url, className, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl h-4/5 flex flex-col	">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription className="hidden">
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center flex-row space-x-2 bg-black flex-grow">
          <div
            className={cx(
              "flex h-full flex-grow flex-row bg-no-repeat bg-center bg-contain",
              css`
                background-image: url("${url}");
              `
            )}
          ></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
