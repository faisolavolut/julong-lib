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

export const Alert: FC<any> = ({
  type,
  onClick,
  children,
  className,
  content,
  msg,
}) => {
  const message: any = {
    save: "Your data will be saved securely. You can update it at any time if needed.",
    delete:
      "This action cannot be undone. This will permanently remove your data from our servers.",
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>{children}</AlertDialogTrigger>
        <AlertDialogContent className={className}>
          {content ? (
            content
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you certain you want to continue?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {msg || message?.[type]}
                </AlertDialogDescription>
              </AlertDialogHeader>
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
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
