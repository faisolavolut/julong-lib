import { FC } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Popover } from "../../Popover/Popover";
import { ButtonBetter } from "../../ui/button";

export type OptionItem = { value: string; label: string };
export const TypeaheadOptions: FC<{
  popup?: boolean;
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
}) => {
  if (!popup) return children;
  const local = useLocal({
    selectedIdx: 0,
  });

  let content = (
    <div
      className={cx(
        className,
        width
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
      {!loading ? (
        <>
          {options.map((item, idx) => {
            const is_selected = selected?.({ item, options, idx });

            if (is_selected) {
              local.selectedIdx = idx;
            }

            return (
              <div
                tabIndex={0}
                key={item.value + "_" + idx}
                className={cx(
                  "opt-item px-3 py-1 cursor-pointer option-item text-sm",
                  is_selected ? "bg-blue-600 text-white" : "hover:bg-blue-50",
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
        </>
      ) : (
        <></>
      )}

      {loading || searching ? (
        <div className="px-4 w-full text-slate-400 text-sm py-2">
          Loading...
        </div>
      ) : (
        <>
          {options.length === 0 && (
            <div className="p-4 w-full text-center text-md text-slate-400">
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
          )}
        </>
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
      classNameTrigger={!isMulti ? "w-full" : ""}
      placement="bottom-start"
      className="flex-1 rounded-md overflow-hidden"
      content={content}
    >
      {children}
    </Popover>
  );
};
