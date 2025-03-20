import { cn } from "@/lib/utils";
import { useLocal } from "@/lib/utils/use-local";
import { FC, useEffect } from "react";
import { IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5";

export const FieldRadio: FC<any> = ({
  fm,
  name,
  onLoad,
  onChange,
  placeholder,
  disabled,
  className,
  mode = "single",
  fields,
}) => {
  const local = useLocal({
    list: [] as any[],
    reload: async () => {
      fm.fields[name] = { ...fields, ...local };
      fm.render();
      const callback = (res: any[]) => {
        if (Array.isArray(res)) {
          local.list = res;
        } else {
          local.list = [];
        }

        local.render();
      };
      const res = onLoad();
      if (res instanceof Promise) res.then(callback);
      else callback(res);
    },
  });
  useEffect(() => {
    fm.fields[name] = { ...fields, ...local };
    const callback = (res: any[]) => {
      if (Array.isArray(res)) {
        local.list = res;
      } else {
        local.list = [];
      }
      local.render();
    };
    const res = onLoad();
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);

  let value =
    mode === "single" && typeof fm.data?.[name] === "string"
      ? [fm.data?.[name]]
      : fm.data?.[name];

  let is_tree = false;
  const applyChanges = (selected: any[]) => {
    selected = selected.filter((e) => e);
    const val = selected.map((e) => e.value);
    if (mode === "single") {
      selected = val?.[0];

      fm.data[name] = selected;
    } else {
      fm.data[name] = val;
    }
    fm.render();

    if (typeof onChange === "function") {
      onChange(fm.data[name]);
    }
  };
  return (
    <>
      <div className={cx("flex items-center w-full flex-row")}>
        <div
          className={cn(
            `flex flex-col p-0.5 flex-1 text-sm `,
            !is_tree && "space-y-1 ",
            className
          )}
        >
          {local.list.map((item, idx) => {
            let isChecked = false;
            try {
              isChecked = value.some((e: any) => e === item.value);
            } catch (ex) {}

            return (
              <div
                key={idx + "_checkbox"}
                onClick={() => {
                  if (!disabled) {
                    let selected = Array.isArray(value)
                      ? value.map((row) => {
                          return local.list.find((e) => e.value === row);
                        })
                      : [];

                    if (isChecked) {
                      selected = selected.filter(
                        (e: any) => e.value !== item.value
                      );
                    } else {
                      if (mode === "single") {
                        selected = [item];
                      } else {
                        selected.push(item);
                      }
                    }
                    applyChanges(selected);
                  }
                }}
                className={cx(
                  "opt-item flex flex-row gap-x-1 cursor-pointer items-center rounded-full p-0.5 ",
                  isChecked && "active"
                )}
              >
                {isChecked ? (
                  <IoRadioButtonOn className="text-primary" />
                ) : (
                  <IoRadioButtonOff className="text-primary" />
                )}
                <div className="">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
