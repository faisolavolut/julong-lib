"use client";
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
import React, { useCallback, useEffect, useState } from "react";
import { Button, Label, Table } from "flowbite-react";
import { HiChevronLeft, HiChevronRight, HiPlus } from "react-icons/hi";
import { useLocal } from "@/lib/utils/use-local";
import { debouncedHandler } from "@/lib/utils/debounceHandler";
import { FaChevronUp } from "react-icons/fa6";
import Link from "next/link";
import { init_column } from "./lib/column";
import { toast } from "sonner";
import { Loader2, Sticker } from "lucide-react";
import { InputSearch } from "../ui/input-search";
import { FaChevronDown } from "react-icons/fa";
import get from "lodash.get";
import { Checkbox } from "../ui/checkbox";
import { getNumber } from "@/lib/utils/getNumber";
import { formatMoney } from "../form/field/TypeInput";
import { cloneFM } from "@/lib/utils/cloneFm";
import { ResizableBox } from "react-resizable";
export const TableEditBetter: React.FC<any> = ({
  name,
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
}) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState([] as any[]);
  const sideLeft =
    typeof header?.sideLeft === "function" ? header.sideLeft : null;
  const sideRight =
    typeof header?.sideRight === "function" ? header.sideRight : null;
  const checkbox =
    Array.isArray(feature) && feature?.length
      ? feature.includes("checkbox")
      : false;
  const local = useLocal({
    table: null as any,
    data: [] as any[],
    dataForm: [] as any[],
    listData: [] as any[],
    sort: {} as any,
    search: null as any,
    count: 0 as any,
    addRow: (row: any) => {
      const data = fm.data?.[name] || [];
      data.push(row);
      fm.data[name] = data;
      fm.render();
      local.data = fm.data[name];
      local.render();
    },
    selection: {
      all: false,
      partial: [] as any[],
    },
    renderRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data = data;
      local.render();
    },
    removeRow: (row: any) => {
      // setData((prev) => prev.filter((item) => item !== row)); // Update state lokal
      // local.data = local.data.filter((item: any) => item !== row); // Hapus row dari local.data
      // local.render(); // Panggil render untuk memperbarui UI
      console.log("HALOO");
      const data = fm.data?.[name] || [];
      // data.push(row);
      if (delete_name) {
        const ids: any[] = Array.isArray(fm.data?.[delete_name])
          ? fm.data?.deleted_line_ids
          : [];
        if (row?.id) {
          ids.push(row.id);
        }
        fm.data[delete_name] = ids;
      }
      fm.data[name] = data.filter((item: any) => item !== row);
      fm.render();
      local.data = fm.data[name];
      local.render();
      console.log({ fm });
      // local.data = fm.data[name];
      // local.render();
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
  // const cloneListFM = (data: any[]) => {
  //   if (mode === "form") {
  //     local.dataForm = data.map((e: any) => cloneFM(fm, e));
  //     local.render();
  //   }
  // };
  useEffect(() => {
    const defaultColumns: any[] = init_column(column);
    const col = defaultColumns?.length
      ? defaultColumns.map((e: any) => {
          return {
            ...e,
            width: e?.width || "auto",
          };
        })
      : ([] as any[]);
    setColumns(col);
    local.data = fm?.data[name] || [];
    local.render();
    console.log(columns);
  }, []);

  const handleResize = (index: any, width: any) => {
    setColumns((prevColumns: any) => {
      const updatedColumns = [...prevColumns];
      updatedColumns[index].width = width;
      return updatedColumns;
    });
  };
  return (
    <>
      <div className="tbl-wrapper flex flex-grow flex-col">
        {!disabledHeader ? (
          <div className="head-tbl-list block items-start justify-between  bg-white px-0 py-4 sm:flex">
            <div className="flex flex-row items-end">
              <div className="sm:flex flex flex-col space-y-2">
                <div className="flex">{sideLeft ? sideLeft(local) : <></>}</div>
              </div>
            </div>
            <div className="ml-auto flex items-center flex-row">
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
                <Table
                  className={cx(
                    "min-w-full divide-y divide-gray-200 text-black",
                    css`
                      thead th:first-child {
                        overflow: hidden;
                        border-top-left-radius: 10px; /* Sudut kiri atas */
                        border-bottom-left-radius: 10px;
                      }
                      thead th:last-child {
                        overflow: hidden;
                        border-top-right-radius: 10px; /* Sudut kiri atas */
                        border-bottom-right-radius: 10px;
                      }
                      tbody td:first-child {
                        overflow: hidden;
                        border-top-left-radius: 10px; /* Sudut kiri atas */
                        border-bottom-left-radius: 10px;
                      }
                      tbody td:last-child {
                        overflow: hidden;
                        border-top-right-radius: 10px; /* Sudut kiri atas */
                        border-bottom-right-radius: 10px;
                      }
                      .react-resizable-handle {
                        cursor: e-resize;
                        width: 2px;
                        height: 100%;
                        background: #313678;
                      }
                      .react-resizable {
                      }
                    `,
                    checkbox &&
                      css`
                        .table-header-tbl > th:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                        }
                        .table-row-element > td:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                        }
                      `
                  )}
                >
                  {!disabledHeadTable ? (
                    <thead className="rounded-md overflow-hidden text-md bg-second group/head text-md uppercase text-gray-700 sticky top-0">
                      <tr className={"table-header-tbl"}>
                        {columns.map((col, idx) => {
                          return (
                            <th
                              key={`${col?.accessorKey}_${idx}`}
                              className={"table-header-tbl capitalize"}
                              style={{
                                width:
                                  col.width === "auto"
                                    ? "auto"
                                    : `${col.width}px`,
                              }}
                            >
                              <div className="flex items-center h-full flex-grow  p-2">
                                <span>{col?.name}</span>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                  ) : (
                    <></>
                  )}
                  <tbody>
                    {local.data.map((row: any, index: any) => {
                      const fm_row = cloneFM(fm, row);
                      return (
                        <tr key={`row_${name}_${index}`}>
                          {columns.map((col, idx) => {
                            const param = {
                              row: row,
                              name: col?.name,
                              idx,
                              tbl: local,
                              fm_row: fm_row,
                              onChange,
                            };
                            const renderData =
                              typeof col?.renderCell === "function" ? (
                                col.renderCell(param)
                              ) : (
                                <>No Column</>
                              );
                            return (
                              <td
                                key={`row_${name}_${index}_${col?.accessorKey}_${idx}`}
                                className={"table-header-tbl capitalize"}
                              >
                                {renderData}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            {!local?.data?.length && (
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
      </div>
    </>
  );
  return (
    <>
      <div className="tbl-wrapper flex flex-grow flex-col">
        {!disabledHeader ? (
          <div className="head-tbl-list block items-start justify-between  bg-white px-0 py-4 sm:flex">
            <div className="flex flex-row items-end">
              <div className="sm:flex flex flex-col space-y-2">
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
                <Table
                  className={cx(
                    "min-w-full divide-y divide-gray-200 ",
                    css`
                      thead th:first-child {
                        overflow: hidden;
                        border-top-left-radius: 10px; /* Sudut kiri atas */
                        border-bottom-left-radius: 10px;
                      }
                      thead th:last-child {
                        overflow: hidden;
                        border-top-right-radius: 10px; /* Sudut kiri atas */
                        border-bottom-right-radius: 10px;
                      }
                      tbody td:first-child {
                        overflow: hidden;
                        border-top-left-radius: 10px; /* Sudut kiri atas */
                        border-bottom-left-radius: 10px;
                      }
                      tbody td:last-child {
                        overflow: hidden;
                        border-top-right-radius: 10px; /* Sudut kiri atas */
                        border-bottom-right-radius: 10px;
                      }
                    `,
                    checkbox &&
                      css`
                        .table-header-tbl > th:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                        }
                        .table-row-element > td:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                        }
                      `
                  )}
                >
                  {!disabledHeadTable ? (
                    <thead className="rounded-md overflow-hidden text-md bg-second group/head text-md uppercase text-gray-700 sticky top-0">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={`${headerGroup.id}`}
                          className={"table-header-tbl"}
                        >
                          {headerGroup.headers.map((header, index) => {
                            const name = header.column.id;
                            const col = column.find(
                              (e: any) => e?.name === name
                            );
                            const isSort =
                              name === "select"
                                ? false
                                : typeof col?.sortable === "boolean"
                                ? col.sortable
                                : true;
                            const resize =
                              name === "select"
                                ? false
                                : typeof col?.resize === "boolean"
                                ? col.resize
                                : true;
                            return (
                              <th
                                {...{
                                  style: {
                                    width: !resize
                                      ? `${col?.width}px`
                                      : name === "select"
                                      ? `${5}px`
                                      : col?.width
                                      ? header.getSize() < col?.width
                                        ? `${col.width}px`
                                        : header.getSize()
                                      : header.getSize(),
                                  },
                                }}
                                key={header.id}
                                colSpan={header.colSpan}
                                className={cx(
                                  "relative px-2 py-2 text-sm py-1 uppercase",
                                  name === "select" &&
                                    css`
                                      max-width: 5px;
                                    `
                                )}
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
                                  <div
                                    className={cx(
                                      "flex flex-row items-center flex-grow text-sm  capitalize",
                                      name === "select" ? "justify-center" : ""
                                    )}
                                  >
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
                                      className: cx(
                                        `resizer  bg-[#b3c9fe] cursor-e-resize	 ${
                                          table.options.columnResizeDirection
                                        } ${
                                          header.column.getIsResizing()
                                            ? "isResizing"
                                            : ""
                                        }`,
                                        css`
                                          width: 1px;
                                          cursor: e-resize !important;
                                        `
                                      ),
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

                  <Table.Body className="divide-y border-none bg-white">
                    {table.getRowModel().rows.map((row, idx) => {
                      const fm_row =
                        mode === "form" ? local.dataForm?.[idx] : null;
                      return (
                        <Table.Row
                          key={row.id}
                          className={cx(
                            disabledHoverRow ? "" : "hover:bg-gray-100",
                            css`
                              height: 44px;
                              > td {
                                vertical-align: ${align};
                              }
                            `,
                            "border-none"
                          )}
                        >
                          {row.getVisibleCells().map((cell: any) => {
                            const ctx = cell.getContext();
                            const param = {
                              row: row.original,
                              name: get(ctx, "column.columnDef.accessorKey"),
                              cell,
                              idx,
                              tbl: local,
                              fm_row: fm_row,
                              onChange,
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
                                  "text-md px-2  py-1  whitespace-nowrap text-gray-900 items-start",
                                  name === "select"
                                    ? css`
                                        width: 5px;
                                      `
                                    : ``
                                )}
                                key={cell.id}
                              >
                                {renderData}
                              </Table.Cell>
                            );
                          })}
                        </Table.Row>
                      );
                    })}
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
          list={local}
          count={local.count}
          onNextPage={() => table.nextPage()}
          onPrevPage={() => table.previousPage()}
          disabledNextPage={!table.getCanNextPage()}
          disabledPrevPage={!table.getCanPreviousPage()}
          page={table.getState().pagination.pageIndex + 1}
          setPage={(page: any) => {
            setPagination({
              pageIndex: page,
              pageSize: 20,
            });
          }}
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
  count,
  list,
  setPage,
  onChangePage,
}) => {
  const local = useLocal({
    page: 1 as any,
    pagination: [] as any,
  });
  useEffect(() => {
    local.page = page;
    local.pagination = getPagination(page, Math.ceil(count / 20));
    local.render();
  }, [page, count]);
  return (
    <div className=" border-t border-gray-300 tbl-pagination sticky text-sm bottom-0 right-0 w-full grid grid-cols-3 gap-4 justify-end text-sm  bg-white pt-2">
      <div className="flex flex-row items-center text-gray-600">
        Showing {local.page * 20 - 19} to{" "}
        {list.data?.length >= 20
          ? local.page * 20
          : local.page === 1 && Math.ceil(count / 20) === 1
          ? list.data?.length
          : local.page * 20 - 19 + list.data?.length}{" "}
        of {formatMoney(getNumber(count))} results
      </div>
      <div className="flex flex-row justify-center">
        <div>
          <nav
            className="isolate inline-flex -space-x-px flex flex-row items-center gap-x-2"
            aria-label="Pagination"
          >
            {local.pagination.map((e: any, idx: number) => {
              return (
                <div
                  key={"page_" + idx}
                  onClick={() => {
                    if (e?.label !== "...") {
                      local.page = getNumber(e?.label);
                      local.render();
                      onChangePage(local.page - 1);
                      setPage(local.page - 1);
                      list.reload();
                    }
                  }}
                  className={cx(
                    "text-sm px-2 py-1",
                    e.active
                      ? "relative z-10 inline-flex items-center bg-primary font-semibold text-white rounded-md"
                      : e?.label === "..."
                      ? "relative z-10 inline-flex items-center  font-semibold text-gray-800 rounded-md"
                      : "cursor-pointer relative z-10 inline-flex items-center hover:bg-gray-100 font-semibold text-gray-800 rounded-md"
                  )}
                >
                  {e?.label}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end">
        <div className="flex items-center  flex-row gap-x-2 sm:mb-0 text-sm">
          <div
            onClick={() => {
              if (!disabledPrevPage) {
                onPrevPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2  justify-center rounded p-1 ",
              disabledPrevPage
                ? "text-gray-200 border-gray-200 border px-2"
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border px-2"
            )}
          >
            <HiChevronLeft className="text-sm" />
            <span>Previous</span>
          </div>
          <div
            onClick={() => {
              if (!disabledNextPage) {
                onNextPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2  justify-center rounded p-1 ",
              disabledNextPage
                ? "text-gray-200 border-gray-200 border px-2"
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border px-2"
            )}
          >
            <span>Next</span>
            <HiChevronRight className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
export const PaginationPage: React.FC<any> = ({
  onNextPage,
  onPrevPage,
  disabledNextPage,
  disabledPrevPage,
  page,
  count,
  list,
  take,
  setPage,
  onChangePage,
}) => {
  const local = useLocal({
    page: 1 as any,
    pagination: [] as any,
  });
  useEffect(() => {
    local.page = page;
    local.pagination = getPagination(page, Math.ceil(count / take));
    local.render();
  }, [page, count]);
  return (
    <div className=" tbl-pagination  text-sm bottom-0 right-0 w-full grid grid-cols-1 gap-4 justify-center text-sm  bg-white pt-2">
      <div className="flex flex-row items-center justify-center">
        <div className="flex items-center  flex-row gap-x-2 sm:mb-0 text-sm">
          <div
            onClick={() => {
              if (!disabledPrevPage) {
                onPrevPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2  justify-center rounded-full p-2 text-md",
              disabledPrevPage
                ? "text-gray-200 border-gray-200 border "
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border "
            )}
          >
            <HiChevronLeft />
          </div>
          <div className="flex flex-row justify-center">
            <div>
              <nav
                className="isolate inline-flex -space-x-px flex flex-row items-center gap-x-2"
                aria-label="Pagination"
              >
                {local.pagination.map((e: any, idx: number) => {
                  return (
                    <div
                      key={"page_" + idx}
                      onClick={() => {
                        if (e?.label !== "...") {
                          local.page = getNumber(e?.label);
                          local.render();
                          onChangePage(local.page - 1);
                          setPage(local.page - 1);
                        }
                      }}
                      className={cx(
                        "text-md px-2.5 py-1",
                        e.active
                          ? "relative z-10 inline-flex items-center bg-primary font-semibold text-white rounded-full"
                          : e?.label === "..."
                          ? "relative z-10 inline-flex items-center  font-semibold text-gray-800 rounded-full"
                          : "cursor-pointer relative z-10 inline-flex items-center hover:bg-gray-100 font-semibold text-gray-800 rounded-full"
                      )}
                    >
                      {e?.label}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
          <div
            onClick={() => {
              if (!disabledNextPage) {
                onNextPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2   justify-center rounded-full p-2 ",
              disabledNextPage
                ? "text-gray-200 border-gray-200 border"
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border "
            )}
          >
            <HiChevronRight className="text-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const getPagination = (currentPage: number, totalPages: number) => {
  const pagination: { label: string; active: boolean }[] = [];
  const maxVisible = 5; // Jumlah maksimal elemen yang ditampilkan
  const halfRange = Math.floor((maxVisible - 3) / 2);

  if (totalPages <= maxVisible) {
    // Jika total halaman lebih kecil dari batas, tampilkan semua halaman
    for (let i = 1; i <= totalPages; i++) {
      pagination.push({ label: i.toString(), active: i === currentPage });
    }
  } else {
    pagination.push({ label: "1", active: currentPage === 1 }); // Halaman pertama selalu ada

    if (currentPage > halfRange + 2) {
      pagination.push({ label: "...", active: false }); // Awal titik-titik
    }

    const startPage = Math.max(2, currentPage - halfRange);
    const endPage = Math.min(totalPages - 1, currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push({ label: i.toString(), active: i === currentPage });
    }

    if (currentPage < totalPages - halfRange - 1) {
      pagination.push({ label: "...", active: false }); // Akhir titik-titik
    }

    pagination.push({
      label: totalPages.toString(),
      active: currentPage === totalPages,
    }); // Halaman terakhir selalu ada
  }

  return pagination;
};
