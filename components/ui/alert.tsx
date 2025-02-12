import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

export const Alert: FC<{
  title?: string;
  type: string;
  onClick?: (event?: any) => Promise<any> | any;
  children?: any;
  className?: string;
  content?: any;
  msg?: any;
  mode?: "auto" | "manual";
  open?: boolean;
  onOpenChange?: (event: boolean) => void;
  hiddenFooter?: boolean;
}> = ({
  title = " Are you certain you want to continue?",
  type,
  onClick,
  children,
  className,
  content,
  msg,
  mode,
  open,
  onOpenChange,
  hiddenFooter = false,
}) => {
  const message: any = {
    save: "Your data will be saved securely. You can update it at any time if needed.",
    delete:
      "This action cannot be undone. This will permanently remove your data from our servers.",
  };
  const param =
    mode === "manual"
      ? {
          open: open,
          onOpenChange: onOpenChange,
        }
      : {};
  return (
    <>
      <AlertDialog {...param}>
        {mode === "manual" ? (
          <></>
        ) : (
          <AlertDialogTrigger>{children}</AlertDialogTrigger>
        )}

        <AlertDialogContent className={className}>
          {content ? (
            content
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {msg || message?.[type]}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {!hiddenFooter ? (
                <>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction
                      className={"bg-primary text-white"}
                      onClick={onClick}
                    >
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
