"use client";
import React, { useEffect, useState } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import get from "lodash.get";
import { cn } from "@/lib/utils";

export const ListBetter: React.FC<any> = ({
  classNameContainer,
  classNameScrollArea,
  autoPagination = true,
  name,
  column,
  style = "UI",
  align = "center",
  onLoad,
  take = 10,
  header,
  disabledPagination,
  disabledHeader,
  disabledHeadTable,
  hiddenNoRow,
  disabledHoverRow,
  onInit,
  onCount,
  fm,
  mode,
  feature,
  onChange,
  content,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [reload, setReload] = useState(0);

  const local = useLocal({
    table: null as any,
    data: [] as any[],
    dataForm: [] as any[],
    listData: [] as any[],
    sort: {} as any,
    search: null as any,
    paging: 1,
    maxPage: 1,
    count: 0 as any,
    ready: false,
    addRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data.push(row);
      local.render();
    },
    selection: {
      all: false,
      partial: [] as any[],
      data: [] as any[],
    },
    renderRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data = data;
      local.render();
    },
    removeRow: (row: any) => {
      setData((prev) => prev.filter((item) => item !== row)); // Update state lokal
      local.data = local.data.filter((item: any) => item !== row); // Hapus row dari local.data
      local.render(); // Panggil render untuk memperbarui UI
    },
    refresh: async () => {
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
        </>,
        {
          duration: Infinity,
        }
      );
      local.ready = false;
      local.render();
      try {
        if (typeof onCount === "function") {
          const res = await onCount();
          local.count = res;
          local.maxPage = Math.ceil(res / take);
          local.paging = 1;
          local.render();
        }
        if (Array.isArray(onLoad)) {
          let res = onLoad;
          local.data = res;
          local.render();
          setData(res);
        } else {
          let res: any = await onLoad({
            search: local.search,
            sort: local.sort,
            take,
            paging: 1,
          });
          local.data = res;
          local.render();
          setData(res);
          setTimeout(() => {
            toast.dismiss();
          }, 100);
        }
      } catch (ex: any) {
        console.error(get(ex, "response.data.meta.message") || ex.message);
      }
      setTimeout(() => {
        toast.dismiss();
      }, 100);
      local.ready = true;
      local.render();
    },
    reload: async () => {
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
        </>,
        {
          duration: Infinity,
        }
      );
      const listData = local.data || [];
      try {
        if (Array.isArray(onLoad)) {
          let res = onLoad;
          local.data = listData.concat(res);
          local.render();
          setData(res);
        } else {
          let res: any = await onLoad({
            search: local.search,
            sort: local.sort,
            take,
            paging: local.paging,
          });
          local.data = listData.concat(res);
          local.render();
          setData(res);
          setTimeout(() => {
            toast.dismiss();
          }, 100);
        }
      } catch (ex: any) {
        console.error(get(ex, "response.data.meta.message") || ex.message);
      }
      setTimeout(() => {
        toast.dismiss();
      }, 100);
    },
  });
  useEffect(() => {
    const run = async () => {
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
        </>,
        {
          duration: Infinity,
        }
      );
      local.ready = false;
      local.render();
      try {
        if (typeof onCount === "function") {
          const res = await onCount();
          setMaxPage(Math.ceil(res / take));
          local.maxPage = Math.ceil(res / take);
          local.count = res;
          local.render();
        }
        if (mode === "form") {
          local.data = fm.data?.[name] || [];
          local.render();
          setData(fm.data?.[name] || []);
        } else {
          if (Array.isArray(onLoad)) {
            local.data = onLoad;
            local.render();
            setData(onLoad);
          } else if (typeof onLoad === "function") {
            let res: any = await onLoad({
              search: local.search,
              sort: local.sort,
              take,
              paging: 1,
            });
            local.data = res;
            local.render();
            setData(local.data);
          } else {
            let res = onLoad;
            local.data = res;
            local.render();
            setData(local.data);
          }
        }
      } catch (ex: any) {
        console.error(get(ex, "response.data.meta.message") || ex.message);
      }
      if (typeof onInit === "function") {
        onInit(local);
      }
      local.ready = true;
      local.render();
      setTimeout(() => {
        toast.dismiss();
      }, 100);
    };
    run();
  }, []);

  const observerRef: any = React.useRef();

  const lastPostRef = React.useCallback((node: any) => {
    if (observerRef) {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (local.paging < local.maxPage) {
            local.paging = local.paging + 1;
            local.render();
            local.reload();
            setReload((r) => r + 1);
          }
        }
      });
      if (node) observerRef.current.observe(node);
    }
  }, []);
  return (
    <>
      <div className="tbl-wrapper flex flex-grow flex-col">
        <ScrollArea
          className={cn(
            "w-full h-full flex flex-col gap-y-4 p-4",
            classNameScrollArea
          )}
          reload={reload}
        >
          {!local.ready ? (
            <>
              <div className="flex-grow h-full flex-grow flex flex-row items-center justify-center">
                <div className="spinner-better"></div>
              </div>
            </>
          ) : (
            <div
              className={cn(
                "flex-grow flex flex-col gap-y-4",
                classNameContainer
              )}
            >
              {Array.isArray(local.data) && local.data?.length ? (
                local.data?.map((e, idx) => {
                  return (
                    <div
                      className="flex flex-col w-full"
                      key={`items-${name}-${idx}`}
                      ref={local.data?.length === idx + 1 ? lastPostRef : null}
                    >
                      {typeof content === "function"
                        ? content({ item: e, idx, tbl: local })
                        : content}
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};
