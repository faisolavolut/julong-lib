"use client";
import { makeData } from "@/lib/utils/makeData";
import {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { FC, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import { useLocal } from "@/lib/utils/use-local";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";

import { init_column } from "../tablelist/lib/column";

export const List: React.FC<any> = ({
  name,
  column,
  onLoad,
  take = 20,
  header,
}) => {
  const sideRight =
    typeof header?.sideRight === "function" ? header.sideRight : null;
  type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
  };
  const local = useLocal({
    data: [] as any[],
    sort: {} as any,
    search: null as any,
    reload: async () => {
      const res: any = onLoad({
        search: local.search,
        sort: local.sort,
        take,
        paging: 1,
      });
      if (res instanceof Promise) {
        res.then((e) => {
          local.data = e;
          local.render();
        });
      } else {
        local.data = res;
        local.render();
      }
    },
  });
  useEffect(() => {
    const res: any = onLoad({
      search: local.search,
      sort: local.sort,
      take: 10,
      paging: 1,
    });
    if (res instanceof Promise) {
      res.then((e) => {
        local.data = e;
        local.render();
      });
    } else {
      local.data = res;
      local.render();
    }
  }, []);
  const defaultColumns: ColumnDef<Person>[] = init_column(column);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const [columnResizeDirection, setColumnResizeDirection] =
    React.useState<ColumnResizeDirection>("ltr");
  // Create the table and pass your options
  const table = useReactTable({
    data: local.data,
    columnResizeMode,
    columnResizeDirection,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: take,
      },
      sorting,
    },
  });

  // Manage your own state
  const [state, setState] = React.useState(table.initialState);

  // Override the state managers for the table to your own
  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    debugTable: state.pagination.pageIndex > 2,
  }));

  return (
    <>
      <div className="p-2 flex flex-grow flex-col">
        <div className="flex flex-col flex-grow">
          <div className="overflow-auto relative flex-grow flex-row">
            <div className="absolute top-0 left-0 inline-block flex-grow w-full h-full align-middle">
              <div className="shadow ">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-700 group/head text-md uppercase text-gray-700  bg-gray-100 dark:bg-gray-700">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={`${headerGroup.id}`} className={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                          const name = header.column.id;
                          const col = column.find((e: any) => e?.name === name);
                          const isSort =
                            typeof col?.sortable === "boolean"
                              ? col.sortable
                              : true;
                          return (
                            <th
                              {...{
                                style: {
                                  width:
                                    col?.width && header.getSize() < col?.width
                                      ? col?.width
                                      : header.getSize(),
                                },
                              }}
                              key={header.id}
                              colSpan={header.colSpan}
                              className="relative bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
                            >
                              <div
                                key={`${header.id}-label`}
                                onClick={() => {
                                  if (isSort) {
                                    const sort = local?.sort?.[name];
                                    const mode =
                                      sort === "desc"
                                        ? null
                                        : sort === "asc"
                                        ? "desc"
                                        : "asc";
                                    local.sort = mode
                                      ? {
                                          [name]: mode,
                                        }
                                      : {};
                                    local.render();
                                  }
                                }}
                                className={cx(
                                  "flex flex-grow flex-row  select-none items-center flex-row",
                                  isSort ? " cursor-pointer" : ""
                                )}
                              >
                                <div className="flex flex-row items-center">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </div>
                                <div className="flex flex-row items-center">
                                  {local?.sort?.[name] === "asc" ? (
                                    <FaArrowUp className="px-0.5 mx-1" />
                                  ) : local?.sort?.[name] === "desc" ? (
                                    <FaArrowDownLong className="px-0.5 mx-1" />
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                              {headerGroup.headers.length !== index + 1 ? (
                                <div
                                  key={`${header.id}-resizer`} // Tambahkan key unik
                                  {...{
                                    onDoubleClick: () =>
                                      header.column.resetSize(),
                                    onMouseDown: header.getResizeHandler(),
                                    onTouchStart: header.getResizeHandler(),
                                    className: `resizer w-0.5 bg-gray-300 ${
                                      table.options.columnResizeDirection
                                    } ${
                                      header.column.getIsResizing()
                                        ? "isResizing"
                                        : ""
                                    }`,
                                    style: {
                                      transform:
                                        columnResizeMode === "onEnd" &&
                                        header.column.getIsResizing()
                                          ? `translateX(${
                                              (table.options
                                                .columnResizeDirection === "rtl"
                                                ? -1
                                                : 1) *
                                              (table.getState().columnSizingInfo
                                                .deltaOffset ?? 0)
                                            }px)`
                                          : "",
                                    },
                                  }}
                                ></div>
                              ) : null}
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>

                  <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {table.getRowModel().rows.map((row) => (
                      <Table.Row
                        key={row.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {row.getVisibleCells().map((cell) => {
                          const ctx = cell.getContext();
                          const param = {
                            row: row.original,
                            name: ctx.column.id,
                            cell,
                          };
                          const head = column.find(
                            (e: any) => e?.name === ctx.column.id
                          );
                          const renderData =
                            typeof head?.renderCell === "function"
                              ? head.renderCell(param)
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                );
                          return (
                            <Table.Cell
                              className="whitespace-nowrap p-4 text-base font-medium text-gray-900 "
                              key={cell.id}
                            >
                              {renderData}
                            </Table.Cell>
                          );
                        })}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

