"use client";
import React from "react";
import { TableList } from "./TableList";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { TabHeaderBetter } from "../tablist/TabHeaderBetter";
import { getNumber } from "@/lib/utils/getNumber";
import { BreadcrumbBetterLink } from "../ui/breadcrumb-link";
export const TableUI: React.FC<any> = ({
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
}) => {
  const local = useLocal({
    tab: get(tab, "[0].id"),
  });

  return (
    <div className="flex flex-col flex-grow">
      <div className="w-full p-4 py-6 pr-6 pl-3 ">
        <div className="flex flex-row  text-2xl font-bold">{title}</div>
        {breadcrumb?.length ? (
          <BreadcrumbBetterLink data={breadcrumb} />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col flex-grow  bg-card-layer rounded-lg border border-gray-300 shadow-md shadow-gray-300 overflow-hidden">
        <div className="flex flex-col flex-grow">
          {tab?.length && (
            <div className="flex flex-row justify-start">
              <div className="flex flex-row">
                <TabHeaderBetter
                  disabledPagination={true}
                  onLabel={(row: any) => {
                    return (
                      <div className="flex flex-row items-center gap-x-2  font-bold">
                        {modeTab !== "only-title" ? (
                          <div className="text-3xl">
                            {getNumber(row?.count) > 999
                              ? "99+"
                              : getNumber(row?.count)}
                          </div>
                        ) : (
                          <></>
                        )}

                        <div className="flex flex-col justify-start ">
                          {modeTab !== "only-title" ? (
                            <div className="text-start">Total</div>
                          ) : (
                            <></>
                          )}

                          <div>{row.name}</div>
                        </div>
                      </div>
                    );
                  }}
                  onValue={(row: any) => {
                    return row.id;
                  }}
                  onLoad={tab}
                  onChange={(tab: any) => {
                    local.tab = tab?.id;
                    local.render();
                    if (typeof onTab === "function") {
                      onTab(local.tab);
                    }
                  }}
                  tabContent={(data: any) => {
                    return <></>;
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col  bg-white mt-[-1px] flex-grow">
            <div className="w-full flex flex-row flex-grow  overflow-hidden ">
              <TableList
                name={name}
                header={header}
                column={column}
                onLoad={onLoad}
                onCount={onCount}
                onInit={onInit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
