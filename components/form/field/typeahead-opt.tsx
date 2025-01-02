import { FC } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Popover } from "../../Popover/Popover";

export type OptionItem = { value: string; label: string };
export const TypeaheadOptions: FC<{
  popup?: boolean;
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
  isMulti?: boolean
}> = ({
  popup,
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
  width,isMulti
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
          overflow: auto
        `
      )}
    >
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

        {searching ? (
          <div className="px-4 w-full text-slate-400">Loading...</div>
        ) : (
          <>
            {options.length === 0 && (
              <div className="p-4 w-full text-center text-md text-slate-400">
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
