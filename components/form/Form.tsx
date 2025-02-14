"use client";
import { useLocal } from "@/lib/utils/use-local";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resize";
import get from "lodash.get";
import { Skeleton } from "../ui/Skeleton";

type Local<T> = {
  data: T | null;
  submit: () => Promise<void>;
  render: () => void;
};

export const Form: React.FC<any> = ({
  children,
  header,
  onLoad,
  onSubmit,
  onFooter,
  showResize,
  mode,
  className,
  onInit,
  afterLoad,
}) => {
  const local = useLocal({
    ready: false,
    data: null as any | null,
    submit: async () => {
      toast.info(
        <>
          <Loader2
            className={cx(
              "h-4 w-4 animate-spin-important",
              css`
                animation: spin 1s linear infinite !important;
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
            )}
          />
          {"Saving..."}
        </>
      );
      try {
        await onSubmit(local);
        setTimeout(() => {
          toast.success(
            <div
              className={cx(
                "cursor-pointer flex flex-col select-none items-stretch flex-1 w-full"
              )}
              onClick={() => {
                toast.dismiss();
              }}
            >
              <div className="flex text-green-700 items-center success-title font-semibold">
                <Check className="h-6 w-6 mr-1 " />
                Record Saved
              </div>
            </div>
          );
        }, 100);
      } catch (ex: any) {
        const msg = get(ex, "response.data.meta.message") || ex.message;
        toast.error(
          <div className="flex flex-col w-full">
            <div className="flex text-red-600 items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Submit Failed {msg}.
            </div>
          </div>,
          {
            dismissible: true,
            className: css`
              background: #ffecec;
              border: 2px solid red;
            `,
          }
        );
      }
    },
    reload: async () => {
      local.ready = false;
      local.render();
      toast.info(
        <>
          <Loader2
            className={cx(
              "h-4 w-4 animate-spin-important",
              css`
                animation: spin 1s linear infinite !important;
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
            )}
          />
          {"Loading..."}
        </>
      );
      local.data = null;
      local.render();
      const res = await onLoad();
      local.ready = true;
      local.data = res;
      local.render();
      if (typeof afterLoad === "function") {
        afterLoad(local);
      }
      setTimeout(() => {
        toast.dismiss();
      }, 100);

      // if (res instanceof Promise) {
      //   res.then((data) => {
      //     local.ready = true;
      //     local.data = data;
      //     local.render(); // Panggil render setelah data diperbarui
      //     // toast.dismiss();
      //     // toast.success("Data Loaded Successfully!");
      //   });
      // } else {
      //   local.ready = true;
      //   local.data = res;
      //   local.render(); // Panggil render untuk memicu re-render
      //   toast.dismiss();
      //   toast.success("Data Loaded Successfully!");
      // }
    },
    fields: {} as any,
    render: () => {},
    error: {} as any,
    onChange: () => {},
    mode,
  });
  useEffect(() => {
    local.onChange();
  }, [local.data]);
  useEffect(() => {
    const run = async () => {
      if (typeof onInit === "function") {
        onInit(local);
      }
      local.ready = false;
      local.render();
      toast.info(
        <>
          <Loader2
            className={cx(
              "h-4 w-4 animate-spin-important",
              css`
                animation: spin 1s linear infinite !important;
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
            )}
          />
          {"Loading..."}
        </>
      );
      const res = await onLoad();

      local.ready = true;
      local.data = res;
      local.render(); // Panggil render setelah data diperbarui
      if (typeof afterLoad === "function") {
        await afterLoad(local);
      }
      setTimeout(() => {
        toast.dismiss();
      }, 100);
    };
    run();
  }, []);

  // Tambahkan dependency ke header agar reaktif
  const HeaderComponent = header(local);
  if (!local.ready)
    return (
      <div className="flex flex-grow flex-row items-center justify-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-16 w-[250px]" />
        </div>
      </div>
    );
  return (
    <div className={`flex-grow flex-col flex ${className}`}>
      <div className="flex flex-row">{header(local)}</div>
      {showResize ? (
        // Resize panels...
        <ResizablePanelGroup direction="vertical" className="rounded-lg border">
          <ResizablePanel className="border-none flex flex-col">
            <form
              className="flex flex-grow flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                local.submit();
              }}
            >
              {local.ready ? (
                children(local)
              ) : (
                <div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              )}
            </form>
          </ResizablePanel>
          <ResizableHandle className="border-none" />
          <ResizablePanel className="border-t-2 flex flex-row flex-grow">
            {typeof onFooter === "function" ? onFooter(local) : null}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <>
          <form
            className="flex flex-grow flex-col flex-grow"
            onSubmit={(e) => {
              e.preventDefault();
              local.submit();
            }}
          >
            {local.ready ? (
              children(local)
            ) : (
              <div className="flex flex-grow flex-row items-center justify-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-16 w-[200px]" />
                </div>
              </div>
            )}
          </form>
          {typeof onFooter === "function" ? onFooter(local) : null}
        </>
      )}
    </div>
  );
};
