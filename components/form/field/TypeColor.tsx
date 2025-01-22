import { useLocal } from "@/lib/utils/use-local";
import Datepicker from "../../ui/Datepicker";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/text-area";
import { Suspense, useEffect } from "react";
import tinycolor from "tinycolor2";
import { HexColorPicker } from "react-colorful";

export const TypeColor: React.FC<any> = ({
  value,
  onChangePicker,
  onClose,
  onChange,
}) => {
  const meta = useLocal({
    originalValue: "",
    inputValue: value,
    rgbValue: "",
    selectedEd: "" as string,
  });
  useEffect(() => {
    meta.inputValue = value || "";
    const convertColor = tinycolor(meta.inputValue);
    meta.rgbValue = convertColor.toRgbString();
    meta.render();
  }, [value]);
  const tin = tinycolor(meta.inputValue);
  return (
    <div className="flex p-3 space-x-4 items-start">
      <div
        className={cx(
          "flex flex-col items-center",
          css`
            .react-colorful__pointer {
              border-radius: 4px;
              width: 20px;
              height: 20px;
            }
          `
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Suspense>
          <HexColorPicker
            color={meta.inputValue}
            onChange={(color) => {
              if (color) {
                meta.inputValue = color;
                onChangePicker(color);
                const convertColor = tinycolor(meta.inputValue);
                meta.rgbValue = convertColor.toRgbString();
              }
            }}
          />
        </Suspense>
      </div>
      <div
        className={cx(
          "grid grid-cols-1 gap-y-0.5",
          css`
            width: 78px;
          `
        )}
      >
        <div
          className="p-[1px] border rounded flex items-center justify-center"
          style={{
            marginBottom: "4px",
          }}
        >
          <input
            value={meta.inputValue || "#FFFFFFFF"}
            className={cx(
              `rounded cursor-text bg-[${meta.inputValue}] min-w-[0px] text-[13px] px-[8px] py-[1px] uppercase`,
              tin.isValid() &&
                css`
                  color: ${!tin.isLight() ? "#FFF" : "#000"};
                  background-color: ${meta.inputValue || ""};
                `
            )}
            spellCheck={false}
            onChange={(e) => {
              const color = e.currentTarget.value;
              meta.inputValue = color;
              onChangePicker(color);
            }}
          />
        </div>

        <div className="">
          {meta.inputValue !== "" && (
            <>
              <div
                className="cursor-pointer text-center border border-gray-200 rounded hover:bg-gray-100"
                onClick={() => {
                  meta.inputValue = "";
                  onChangePicker("");
                }}
              >
                Reset
              </div>
            </>
          )}

          {onClose && (
            <div
              className="cursor-pointer text-center border border-gray-200 rounded hover:bg-gray-100 mt-[4px]"
              onClick={onClose}
            >
              Close
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
