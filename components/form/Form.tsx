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
import { normalDate } from "@/lib/utils/date";

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
        const fieldDate: any = local?.fields;
        let isError = false;
        let error: Record<string, string> = {};
        try {
          const dateFields = Object.values(fieldDate).filter(
            (field: any) => get(field, "type") === "date"
          );
          if (dateFields.length) {
            dateFields.forEach((e: any) => {
              if (e?.name) {
                local.data[e.name] = normalDate(local.data[e.name]);
              }
            });
            local.render();
          }
        } catch (ex) {
          console.error("Error processing date fields:", ex);
        }

        const fieldRequired = Object.values(fieldDate).filter(
          (field: any) => field?.required || field?.type === "table"
        );

        if (fieldRequired.length) {
          fieldRequired.forEach((e: any) => {
            let keys = e?.name;
            const type = e?.type;

            if (type === "table" && e?.fields?.length) {
              e.fields.forEach((item: any, index: number) => {
                let errorChilds: Record<string, string> = {};
                const fieldRequired = Object.values(item?.fields).filter(
                  (field: any) => field?.required
                );
                console.log({ fieldRequired });
                fieldRequired.forEach((subField: any) => {
                  let keySub = subField?.name;
                  const typeSub = subField?.type;
                  const val = get(local.data, `${keys}[${index}].${keySub}`);
                  if (["dropdown-async", "multi-async"].includes(typeSub)) {
                    keySub = subField?.target || subField?.name;
                  }
                  if (
                    [
                      "multi-dropdown",
                      "checkbox",
                      "multi-upload",
                      "multi-async",
                    ].includes(typeSub)
                  ) {
                    if (!Array.isArray(get(local.data, keys)) || !val?.length) {
                      errorChilds[subField.name] =
                        "This field requires at least one item.";
                      isError = true;
                    }
                  } else if (!val) {
                    errorChilds[subField.name] = "Please fill out this field.";
                    isError = true;
                  }

                  console.log({
                    keySub,
                    data: get(local.data, `${keys}[${index}]`),
                    val,
                  });
                });

                item.error = errorChilds;
              });
            } else {
              if (["dropdown-async", "multi-async"].includes(type)) {
                keys = e?.target || e?.name;
              }
              const val = get(local.data, keys);
              if (
                [
                  "multi-dropdown",
                  "checkbox",
                  "multi-upload",
                  "multi-async",
                ].includes(type)
              ) {
                if (!Array.isArray(val) || !val?.length) {
                  error[e.name] = "This field requires at least one item.";
                  isError = true;
                }
              } else if (!val) {
                error[e.name] = "Please fill out this field.";
                isError = true;
              }
            }
          });
        }

        local.error = error;
        local.render();
        if (isError) {
          throw new Error("please check your input field.");
        } else {
          await onSubmit(local);
        }
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
  const HeaderComponent = typeof header === "function" ? header(local) : <></>;
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
    <div className={`flex-grow flex-col flex h-full ${className}`}>
      <div className="flex flex-row">{HeaderComponent}</div>
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
            className="flex flex-col "
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
          {typeof onFooter === "function" ? (
            <div
              className={cx(
                "flex flex-grow flex-col",
                css`
                  .tbl {
                    position: relative;
                  }
                `
              )}
            >
              {onFooter(local)}
            </div>
          ) : (
            <div className="flex flex-grow flex-col"></div>
          )}
        </>
      )}
    </div>
  );
};
