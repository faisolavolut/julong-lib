"use client";
import React from "react";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { ListBetter } from "../tablelist/List";
import { cn } from "@/lib/utils";
export const ListUI: React.FC<any> = ({
  tabHeader,
  className,
  classNameScrollArea,
  name,
  modeTab,
  column,
  align = "center",
  onLoad,
  take = 20,
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
  delete_name,
  title,
  tab,
  onTab,
  breadcrumb,
  classNameContainer,
  content,
  ready = true,
}) => {
  const local = useLocal({
    tab: get(tab, "[0].id"),
    table: {
      count: 0 as number,
    } as any,
    show: true as boolean,
    count: 0 as number,
    readyTitle: true,
  });
  if (!ready) {
    return (
      <div className="flex-grow flex-grow flex flex-row items-center justify-center">
        <div className="spinner-better"></div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col flex-grow  rounded-lg border border-gray-200 py-2 overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col  flex-grow">
          {title ? (
            <div className="flex flex-col w-full px-4 pt-2">
              {typeof title === "function"
                ? title({ ui: local, count: local.count })
                : title}
            </div>
          ) : (
            <></>
          )}

          <div className="w-full flex flex-row flex-grow  overflow-hidden ">
            <ListBetter
              name={name}
              classNameScrollArea={classNameScrollArea}
              classNameContainer={classNameContainer}
              content={content}
              onLoad={onLoad}
              onCount={async (params: any) => {
                const result = await onCount();
                local.count = result;
                local.render();
                return result;
              }}
              onInit={(e: any) => {
                local.readyTitle = false;
                local.table = e;
                local.render();
                setTimeout(() => {
                  local.readyTitle = true;
                  local.render();
                }, 100);
                if (typeof onInit === "function") {
                  onInit(e);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
