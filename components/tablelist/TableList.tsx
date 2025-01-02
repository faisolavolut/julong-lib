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
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiHome,
  HiOutlinePencilAlt,
  HiPlus,
  HiSearch,
  HiTrash,
} from "react-icons/hi";
import classNames from "classnames";
import { useLocal } from "@/lib/utils/use-local";
import { debouncedHandler } from "@/lib/utils/debounceHandler";
import { FaArrowDownLong, FaArrowUp, FaChevronUp } from "react-icons/fa6";

import Link from "next/link";
import { init_column } from "./lib/column";
import { toast } from "sonner";
import { Check, Loader2, Sticker } from "lucide-react";
import { InputSearch } from "../ui/input-search";
import { Input } from "../ui/input";
import { FaChevronDown } from "react-icons/fa";
import get from "lodash.get";

export const TableList: React.FC<any> = ({
  name,
  column,
  onLoad,
  take = 50,
  header,
  disabledPagination,
  disabledHeader,
  disabledHeadTable,
  hiddenNoRow,
  disabledHoverRow,
  onInit,
}) => {
  const [data, setData] = useState<any[]>([]);
  const sideLeft =
    typeof header?.sideLeft === "function" ? header.sideLeft : null;
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
    table: null as any,
    data: [] as any[],
    sort: {} as any,
    search: null as any,
    addRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data.push(row);
      local.render();
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
        </>
      );
      if (Array.isArray(onLoad)) {
        local.data = onLoad;
        local.render();
        setData(onLoad);
      } else {
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
            setData(e);
            setTimeout(() => {
              toast.dismiss();
            }, 2000);
          });
        } else {
          local.data = res;
          local.render();
          setData(res);
          setTimeout(() => {
            toast.dismiss();
          }, 2000);
        }
      }
    },
  });
  useEffect(() => {
    if (typeof onInit === "function") {
      onInit(local);
    }
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
    if (Array.isArray(onLoad)) {
      local.data = onLoad;
      local.render();
      setData(onLoad);
    } else {
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
          setData(e);
          setTimeout(() => {
            toast.dismiss();
          }, 2000);
        });
      } else {
        local.data = res;
        local.render();
        setData(res);
        setTimeout(() => {
          toast.dismiss();
        }, 2000);
      }
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
  useEffect(() => {
    setData(local.data);
  }, [local.data.length]);
  const paginationConfig = disabledPagination
    ? {}
    : {
        getPaginationRowModel: getPaginationRowModel(),
      };
  const table = useReactTable({
    data: data,
    columnResizeMode,
    columnResizeDirection,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 25, //custom default page size
      },
    },
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
      sorting,
    },
    ...paginationConfig,
  });
  local.table = table;

  // Manage your own state
  const [state, setState] = React.useState(table.initialState);

  // Override the state managers for the table to your own
  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    debugTable: state.pagination.pageIndex > 2,
  }));
  const handleSearch = useCallback(
    debouncedHandler(() => {
      local.reload();
    }, 1000), // 1 detik jeda
    []
  );
  return (
    <>
      <div className="tbl-wrapper flex flex-grow flex-col">
        {!disabledHeader ? (
          <div className="head-tbl-list block items-start justify-between border-b border-gray-200 bg-white p-4 sm:flex">
            <div className="flex flex-row items-end">
              <div className="sm:flex flex flex-col space-y-2">
                {false ? (
                  <div className="">
                    <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">
                      All <span className="">{name ? `${name}s` : ``}</span>
                    </h2>
                  </div>
                ) : (
                  <></>
                )}

                <div className="flex">
                  {sideLeft ? (
                    sideLeft(local)
                  ) : (
                    <>
                      <Link href={"/new"}>
                        <Button className="bg-primary">
                          <div className="flex items-center gap-x-0.5">
                            <HiPlus className="text-xl" />
                            <span className="capitalize">Add {name}</span>
                          </div>
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center flex-row">
              <div className="tbl-search hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await local.reload();
                  }}
                >
                  <Label htmlFor="users-search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative  lg:w-56">
                    <InputSearch
                      // className="bg-white search text-xs "
                      id="users-search"
                      name="users-search"
                      placeholder={`Search`}
                      onChange={(e) => {
                        const value = e.target.value;
                        local.search = value;
                        local.render();
                        handleSearch();
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="flex">{sideRight ? sideRight(local) : <></>}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col flex-grow">
          <div className="overflow-auto relative flex-grow flex-row">
            <div className="tbl absolute top-0 left-0 inline-block flex-grow w-full h-full align-middle">
              <div className="relative">
                <Table className="min-w-full divide-y divide-gray-200 ">
                  {!disabledHeadTable ? (
                    <thead className="text-md bg-second group/head text-md uppercase text-gray-700 sticky top-0">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={`${headerGroup.id}`}
                          className={headerGroup.id}
                        >
                          {headerGroup.headers.map((header, index) => {
                            const name = header.column.id;
                            const col = column.find(
                              (e: any) => e?.name === name
                            );
                            const isSort =
                              typeof col?.sortable === "boolean"
                                ? col.sortable
                                : true;
                            return (
                              <th
                                {...{
                                  style: {
                                    width: col?.width
                                      ? header.getSize() < col?.width
                                        ? `${col.width}px`
                                        : header.getSize()
                                      : header.getSize(),
                                  },
                                }}
                                key={header.id}
                                colSpan={header.colSpan}
                                className="relative px-2 py-2 text-sm py-1 "
                              >
                                <div
                                  key={`${header.id}-label`}
                                  {...{
                                    style: col?.width
                                      ? {
                                          minWidth: `${col.width}px`,
                                        }
                                      : {},
                                  }}
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

                                      local.reload();
                                    }
                                  }}
                                  className={cx(
                                    "flex flex-grow flex-row  flex-grow select-none items-center flex-row text-base text-nowrap",
                                    isSort ? " cursor-pointer" : ""
                                  )}
                                >
                                  <div className="flex flex-row items-center flex-grow text-sm">
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </div>
                                  {isSort ? (
                                    <div className="flex flex-col items-center">
                                      <FaChevronUp
                                        className={cx(
                                          "px-0.5 mx-1  text-[12px]",
                                          local?.sort?.[name] === "asc"
                                            ? "text-black"
                                            : "text-gray-500"
                                        )}
                                      />
                                      <FaChevronDown
                                        className={cx(
                                          "px-0.5 mx-1  text-[12px]",
                                          local?.sort?.[name] === "desc"
                                            ? "text-black"
                                            : "text-gray-500"
                                        )}
                                      />
                                    </div>
                                  ) : (
                                    <></>
                                  )}
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
                                                  .columnResizeDirection ===
                                                "rtl"
                                                  ? -1
                                                  : 1) *
                                                (table.getState()
                                                  .columnSizingInfo
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
                  ) : (
                    <></>
                  )}

                  <Table.Body className="divide-y divide-gray-200 bg-white">
                    {table.getRowModel().rows.map((row, idx) => (
                      <Table.Row
                        key={row.id}
                        className={cx(
                          disabledHoverRow ? "" : "hover:bg-[#DBDBE7]",
                          css`
                            height: 44px;
                          `
                        )}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const ctx = cell.getContext();
                          const param = {
                            row: row.original,
                            name: get(ctx, "column.columnDef.accessorKey"),
                            cell,
                            idx,
                            tbl: local,
                          };
                          const head = column.find(
                            (e: any) =>
                              e?.name ===
                              get(ctx, "column.columnDef.accessorKey")
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
                              className={cx(
                                "text-md px-2  py-1  whitespace-nowrap text-gray-900 "
                              )}
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
            {!hiddenNoRow && !table.getRowModel().rows?.length && (
              <div
                className={cx(
                  "flex-1 w-full absolute inset-0 flex flex-col items-center justify-center",
                  css`
                    top: 50%;
                    transform: translateY(-50%);
                  `
                )}
              >
                <div className="max-w-[15%] flex flex-col items-center">
                  <Sticker size={35} strokeWidth={1} />
                  <div className="pt-1 text-center">No&nbsp;Data</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Pagination
          onNextPage={() => table.nextPage()}
          onPrevPage={() => table.previousPage()}
          disabledNextPage={!table.getCanNextPage()}
          disabledPrevPage={!table.getCanPreviousPage()}
          page={table.getState().pagination.pageIndex + 1}
          countPage={table.getPageCount()}
          countData={local.data.length}
          take={take}
          onChangePage={(page: number) => {
            table.setPageIndex(page);
          }}
        />
      </div>
    </>
  );
};

export const Pagination: React.FC<any> = ({
  onNextPage,
  onPrevPage,
  disabledNextPage,
  disabledPrevPage,
  page,
  countPage,
  countData,
  take,
  onChangePage,
}) => {
  const local = useLocal({
    page: 1 as any,
  });
  useEffect(() => {
    local.page = page;
    local.render();
  }, [page]);
  return (
    <div className="tbl-pagination sticky text-sm bottom-0 right-0 w-full items-center justify-end text-sm border-t border-gray-200 bg-white p-4 sm:flex">
      <div className="mb-4 flex items-center sm:mb-0">
        <div
          onClick={() => {
            if (!disabledPrevPage) {
              onPrevPage();
            }
          }}
          className={classNames(
            "inline-flex  justify-center rounded p-1 ",
            disabledPrevPage
              ? "text-gray-200"
              : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </div>
        <div
          onClick={() => {
            if (!disabledNextPage) {
              onNextPage();
            }
          }}
          className={classNames(
            "inline-flex  justify-center rounded p-1 ",
            disabledNextPage
              ? "text-gray-200"
              : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </div>
        <span className="text-md font-normal text-gray-500">
          Page&nbsp;
          <span className="font-semibold text-gray-900">{page}</span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900">{countPage}</span>
        </span>

        <span className="flex items-center pl-2 text-black gap-x-2">
          | Go to page:
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const page = Number(local.page);
              if (!page) {
                local.page = 0;
              } else if (page > countPage) {
                local.page = countPage;
              }
              local.render();
              onChangePage(local.page - 1);
            }}
          >
            <Input
              type="number"
              min="1"
              max={countPage}
              value={local.page}
              onChange={(e) => {
                local.page = e.target.value;
                local.render();
                debouncedHandler(() => {
                  const page = Number(local.page);
                  if (!page) {
                    local.page = 0;
                  } else if (page > countPage) {
                    local.page = countPage;
                  }
                  local.render();
                  onChangePage(local.page - 1);
                }, 1500);
              }}
            />
          </form>
        </span>
      </div>
      <div className="flex items-center space-x-3 hidden">
        {!disabledPrevPage ? (
          <>
            <div
              onClick={() => {
                if (!disabledPrevPage) {
                  onPrevPage();
                }
              }}
              className={classNames(
                "cursor-pointer inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-center text-md font-medium text-white hover:bg-primary focus:ring-4 focus:ring-primary-300"
              )}
            >
              <HiChevronLeft className="mr-1 text-base" />
              Previous
            </div>
          </>
        ) : (
          <></>
        )}
        {!disabledNextPage ? (
          <>
            <div
              onClick={() => {
                if (!disabledNextPage) {
                  onNextPage();
                }
              }}
              className={classNames(
                "cursor-pointer inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-center text-md font-medium text-white hover:bg-primary focus:ring-4 focus:ring-primary-300"
              )}
            >
              Next
              <HiChevronRight className="ml-1 text-base" />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
