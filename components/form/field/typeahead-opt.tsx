import { FC } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Popover } from "../../Popover/Popover";
import { ButtonBetter } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { ScrollArea } from "../../ui/scroll-area";
import { IoCheckmark, IoSearchOutline } from "react-icons/io5";

export type OptionItem = { value: string; label: string };
export const TypeaheadOptions: FC<{
  popup?: boolean;
  onRemove?: (data: any) => void;
  onSelectAll?: (data: boolean) => void;
  init?: any;
  loading?: boolean;
  open?: boolean;
  children: any;
  onOpenChange?: (open: boolean) => void;
  options: OptionItem[];
  className?: string;
  showEmpty: boolean;
  selected?: (arg: {
    item: OptionItem;
    options: OptionItem[];
    idx: number;
  }) => boolean;
  onSelect?: (value: string) => void;
  searching?: boolean;
  searchText?: string;
  width?: number;
  isMulti?: boolean;
  fitur?: "search-add";
  isBetter?: boolean;
  onSearch?: (event: any) => void;
  search?: boolean;
}> = ({
  popup,
  loading,
  children,
  open,
  onOpenChange,
  className,
  options,
  selected,
  onSelect,
  searching,
  searchText,
  showEmpty,
  width,
  isMulti,
  fitur,
  isBetter,
  init,
  onSearch,
  search,
  onRemove,
  onSelectAll,
}) => {
  if (!popup) return children;
  const local = useLocal({
    selectedIdx: 0,
  });

  let content = (
    <div
      className={cx(
        className,
        "flex flex-col",
        isBetter
          ? css`
              min-width: 350px;
              height: 450px;
            `
          : width
          ? css`
              min-width: ${width}px;
            `
          : css`
              min-width: 150px;
            `,
        css`
          max-height: 400px;
          overflow: auto;
        `
      )}
    >
      {isBetter ? (
        <>
          <div className="flex flex-row w-full p-1">
            <div className="flex-grow flex flex-row relative">
              <div
                className={cx(
                  "absolute left-0 px-1.5",
                  css`
                    top: 50%;
                    transform: translateY(-50%);
                  `
                )}
              >
                <IoSearchOutline />
              </div>

              <input
                placeholder={"Search"}
                type="text"
                spellCheck={false}
                onChange={onSearch}
                className={cx(
                  "pl-6 pr-3 py-1 rounded-md text-black flex h-9 flex-grow border border-gray-200 bg-white  text-base  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm focus:outline-none focus:ring-0"
                )}
              />
            </div>
          </div>
          {init.search.input === "" || !init.search.input ? (
            <div className="flex flex-row px-3 py-1 gap-x-2 items-center cursor-pointer">
              <Checkbox
                id="terms"
                className="border border-primary"
                checked={init?.selectBetter?.all ? true : false}
                onClick={(e) => {
                  init.selectBetter.all = !init.selectBetter.all;
                  init.render();
                  if (typeof onSelectAll === "function")
                    onSelectAll(init.selectBetter.all);
                }}
              />
              Select All
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      {loading || searching ? (
        <div
          className={cx(
            isBetter && "flex-grow flex flex-row items-center justify-center",
            "px-4 w-full text-slate-400 text-sm py-2"
          )}
        >
          Loading...
        </div>
      ) : (
        <>
          {options.length === 0 ? (
            <div
              className={cx(
                isBetter &&
                  "flex-grow flex flex-row items-center justify-center",
                "p-4 w-full text-center text-md text-slate-400"
              )}
            >
              {fitur === "search-add" ? (
                <ButtonBetter
                  variant={"outline"}
                  className="flex flex-row gap-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      strokeWidth={1.5}
                      d="M6 12h12m-6 6V6"
                    ></path>
                  </svg>{" "}
                  <span>
                    Add{" "}
                    <span
                      className={css`
                        font-style: italic;
                      `}
                    >
                      "{searchText}"
                    </span>
                  </span>
                </ButtonBetter>
              ) : (
                <>
                  {!searchText ? (
                    <>&mdash; Empty &mdash;</>
                  ) : (
                    <>
                      Search
                      <span
                        className={css`
                          font-style: italic;
                          padding: 0px 5px;
                        `}
                      >
                        "{searchText}"
                      </span>
                      not found
                    </>
                  )}
                </>
              )}
            </div>
          ) : isBetter ? (
            <ScrollArea className="w-full flex-grow flex flex-col gap-y-2">
              {options.map((item, idx) => {
                const is_selected = isBetter
                  ? init.selectBetter.all
                    ? true
                    : selected?.({ item, options, idx })
                  : selected?.({ item, options, idx });

                if (is_selected) {
                  local.selectedIdx = idx;
                }
                if (isBetter) {
                  return (
                    <div
                      className="flex flex-row px-3 py-1 gap-x-2 items-center cursor-pointer"
                      key={item.value + "_" + idx}
                    >
                      <Checkbox
                        id="terms"
                        className="border border-primary"
                        checked={is_selected}
                        onClick={() => {
                          if (is_selected) {
                            if (typeof onRemove === "function") onRemove(item);
                          } else {
                            onSelect?.(item.value);
                          }
                        }}
                      />
                      {item.label || <>&nbsp;</>}
                    </div>
                  );
                }
                return (
                  <div
                    tabIndex={0}
                    key={item.value + "_" + idx}
                    className={cx(
                      "opt-item px-3 py-1 cursor-pointer option-item text-sm",
                      is_selected
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-50",
                      idx > 0 && "border-t"
                    )}
                    onClick={() => {
                      onSelect?.(item.value);
                    }}
                  >
                    {item.label || <>&nbsp;</>}
                  </div>
                );
              })}
            </ScrollArea>
          ) : (
            <div className="w-full flex-grow flex flex-col">
              {options.map((item, idx) => {
                const is_selected = isBetter
                  ? init.selectBetter.all
                    ? true
                    : selected?.({ item, options, idx })
                  : selected?.({ item, options, idx });

                if (is_selected) {
                  local.selectedIdx = idx;
                }
                if (isBetter) {
                  return (
                    <div
                      className="flex flex-row px-3 py-1 gap-x-2 items-center cursor-pointer"
                      key={item.value + "_" + idx}
                    >
                      <Checkbox
                        id="terms"
                        className="border border-primary"
                        checked={is_selected}
                        onClick={() => {
                          if (is_selected) {
                            if (typeof onRemove === "function") onRemove(item);
                          } else {
                            onSelect?.(item.value);
                          }
                        }}
                      />
                      {item.label || <>&nbsp;</>}
                    </div>
                  );
                }
                return (
                  <div
                    tabIndex={0}
                    key={item.value + "_" + idx}
                    className={cx(
                      "opt-item px-3 py-1 cursor-pointer option-item text-sm",
                      is_selected
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-50",
                      idx > 0 && "border-t"
                    )}
                    onClick={() => {
                      onSelect?.(item.value);
                    }}
                  >
                    {item.label || <>&nbsp;</>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {false ? (
        <div className="w-full flex flex-row items-center justify-end p-1 border-t border-gray-200">
          <ButtonBetter className="rounded-md text-xs flex flex-row items-center gap-x-1">
            <IoCheckmark />
            OK
          </ButtonBetter>
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  if (!showEmpty && options.length === 0) content = <></>;

  return (
    <Popover
      open={open}
      arrow={false}
      onOpenChange={onOpenChange}
      backdrop={false}
      classNameTrigger={!isMulti ? "w-full" : "flex-grow"}
      placement="bottom-start"
      className="flex-1 rounded-md overflow-hidden"
      content={content}
    >
      {children}
    </Popover>
  );
};
