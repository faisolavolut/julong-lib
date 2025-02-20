import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocal } from "@/lib/utils/use-local";
import { TypeaheadOptions } from "./typeahead-opt";
import { Badge } from "../../ui/badge";
import { GoChevronDown } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { X } from "lucide-react";
import uniqBy from "lodash.uniqby";

type OptItem = { value: string; label: string; tag?: string };

export const TypeaheadBetter: FC<{
  fitur?: "search-add";
  value?: string[] | null;
  placeholder?: string;
  required?: boolean;
  options?: (arg: {
    search: string;
    existing: OptItem[];
  }) => (string | OptItem)[] | Promise<(string | OptItem)[]>;
  onSelect?: (arg: { search: string; item?: null | OptItem }) => string | false;
  onChange?: (selected: string[]) => void;
  unique?: boolean;
  allowNew?: boolean;
  className?: string;
  popupClassName?: string;
  localSearch?: boolean;
  autoPopupWidth?: boolean;
  focusOpen?: boolean;
  disabled?: boolean;
  mode?: "multi" | "single";
  note?: string;
  disabledSearch?: boolean;
  onInit?: (e: any) => void;
  isBetter?: boolean;
}> = ({
  value,
  fitur,
  note,
  options: options_fn,
  onSelect,
  unique,
  allowNew: allow_new,
  focusOpen: on_focus_open,
  localSearch: local_search,
  autoPopupWidth: auto_popup_width,
  placeholder,
  mode,
  disabled,
  onChange,
  className,
  popupClassName,
  disabledSearch,
  onInit,
  isBetter = false,
}) => {
  const maxLength = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const local = useLocal({
    value: [] as string[],
    open: false,
    options: [] as OptItem[],
    loaded: false,
    loading: false,
    selectBetter: {
      all: false,
      partial: [] as any[],
    },
    search: {
      input: "",
      timeout: null as any,
      searching: false,
      promise: null as any,
      result: null as null | OptItem[],
    },
    unique: typeof unique === "undefined" ? true : unique,
    allow_new: typeof allow_new === "undefined" ? false : allow_new,
    on_focus_open: typeof on_focus_open === "undefined" ? true : on_focus_open,
    local_search: typeof local_search === "undefined" ? true : local_search,
    mode: typeof mode === "undefined" ? "multi" : mode,
    auto_popup_width:
      typeof auto_popup_width === "undefined" ? false : auto_popup_width,
    select: null as null | OptItem,
  });
  const input = useRef<HTMLInputElement>(null);

  let select_found = false;
  let options = [...(local.search.result || local.options)];

  const added = new Set<string>();
  if (local.mode === "multi") {
    options = options.filter((e) => {
      if (!added.has(e.value)) added.add(e.value);
      else return false;
      if (local.select && local.select.value === e.value) select_found = true;
      if (local.unique) {
        if (local.value.includes(e.value)) {
          return false;
        }
      }
      return true;
    });
    if (Array.isArray(value) && value?.length) {
      if (!select_found) {
        local.select = options[0];
      }
    }
  }

  useEffect(() => {
    if (!value) return;
    if (options.length === 0) {
      loadOptions().then(() => {
        if (typeof value === "object" && value) {
          local.value = value;
          local.render();
        } else if (typeof value === "string") {
          local.value = [value];
          local.render();
        }
      });
    } else {
      if (typeof value === "object" && value) {
        local.value = value;
        local.render();
      } else {
        local.value = [];
        local.render();
      }
    }
  }, [value]);

  const select = useCallback(
    (arg: { search: string; item?: null | OptItem }) => {
      if (!local.allow_new) {
        let found = null;
        if (!arg.item) {
          found = options.find((e) => e.value === arg.search);
        } else {
          found = options.find((e) => e.value === arg.item?.value);
        }
        if (!found) {
          return false;
        }
      }
      if (local.unique) {
        let found = local.value.find((e) => {
          return e === arg.item?.value || arg.search === e;
        });
        if (found) {
          return false;
        }
      }

      if (local.mode === "single") {
        local.value = [];
      }

      if (typeof onSelect === "function") {
        const result = onSelect(arg);

        if (result) {
          local.value.push(result);
          local.render();

          if (typeof onChange === "function") {
            onChange(local.value);
          }
          return result;
        } else {
          return false;
        }
      } else {
        let val = false as any;
        if (arg.item) {
          local.value.push(arg.item.value);
          val = arg.item.value;
        } else {
          if (!arg.search) return false;
          local.value.push(arg.search);
          val = arg.search;
        }

        if (typeof onChange === "function") {
          onChange(local.value);
        }
        local.render();
        return val;
      }
      return true;
    },
    [onSelect, local.value, options]
  );

  const keydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (local.value.length > 0 && e.currentTarget.selectionStart === 0) {
          local.value.pop();
          local.render();
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const selected = select({
          search: local.search.input,
          item: local.select,
        });

        if (local.mode === "single") {
          local.open = false;
        }
        if (typeof selected === "string") {
          if (!allow_new) resetSearch();
          if (local.mode === "single") {
            const item = options.find((item) => item.value === selected);
            if (item) {
              local.search.input = item.label;
            }
          }
        }

        local.render();
        return;
      }
      if (options.length > 0) {
        local.open = true;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();

          const idx = options.findIndex((item) => {
            if (item.value === local.select?.value) return true;
          });
          if (idx >= 0) {
            if (idx + 1 <= options.length - 1) {
              local.select = options[idx + 1];
            } else {
              local.select = options[0];
            }
          } else {
            local.select = options[0];
          }
          local.render();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();

          const idx = options.findIndex((item) => {
            if (item.value === local.select?.value) return true;
          });
          if (idx >= 0) {
            if (idx - 1 >= 0) {
              local.select = options[idx - 1];
            } else {
              local.select = options[options.length - 1];
            }
          } else {
            local.select = options[0];
          }
          local.render();
        }
      }
    },
    [local.value, local.select, select, options, local.search.input]
  );

  const loadOptions = useCallback(async () => {
    if (typeof options_fn === "function" && !local.loading) {
      local.loading = true;
      local.loaded = false;
      local.render();
      const res = options_fn({
        search: local.search.input,
        existing: options,
      });

      if (res) {
        const applyOptions = (result: (string | OptItem)[]) => {
          local.options = result.map((item) => {
            if (typeof item === "string") return { value: item, label: item };
            return item;
          });
          local.render();
        };

        if (res instanceof Promise) {
          const result = await res;
          applyOptions(result);
        } else {
          applyOptions(res);
        }
        local.loaded = true;
        local.loading = false;
        local.render();
      }
    }
  }, [options_fn]);
  useEffect(() => {
    if (typeof onInit === "function") {
      onInit({
        reload: async () => {
          if (typeof options_fn === "function" && !local.loading) {
            local.loading = true;
            local.loaded = false;
            local.render();
            const res = options_fn({
              search: local.search.input,
              existing: options,
            });

            if (res) {
              const applyOptions = (result: (string | OptItem)[]) => {
                local.options = result.map((item) => {
                  if (typeof item === "string")
                    return { value: item, label: item };
                  return item;
                });
                local.render();
              };

              if (res instanceof Promise) {
                const result = await res;
                applyOptions(result);
              } else {
                applyOptions(res);
              }
              local.loaded = true;
              local.loading = false;
              local.render();
            }
          }
        },
      });
    }
  }, []);
  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm); // Update debounced term after 1 second
    }, 100);

    return () => clearTimeout(timer); // Clear timeout if user types again
  }, [searchTerm]);

  // Function to handle search
  useEffect(() => {
    if (debouncedTerm) {
      performSearch(debouncedTerm);
    }
  }, [debouncedTerm]);

  const performSearch = (value: any) => {
    if (typeof onSelect === "function") {
      const result = onSelect({
        search: value,
        item: {
          label: value,
          value: value,
        },
      });

      if (result) {
        local.value.push(result);
        local.render();

        if (typeof onChange === "function") {
          onChange(local.value);
        }
        return result;
      } else {
        return false;
      }
    }
    // Lakukan pencarian, panggil API, atau filter data di sini
  };
  const resetSearch = () => {
    local.search.searching = false;
    local.search.input = "";
    local.search.promise = null;
    local.search.result = null;
    local.select = null;
    clearTimeout(local.search.timeout);
  };

  if (local.mode === "single" && local.value.length > 1) {
    local.value = [local.value.pop() || ""];
  }

  if (local.value.length === 0) {
    if (local.mode === "single") {
      if (!local.open && !allow_new) {
        local.select = null;

        local.search.input = "";
      }
    }
  }

  const valueLabel = uniqBy(
    local.value?.map((value) => {
      if (local.mode === "single") {
        const item = options.find((item) => item.value === value);

        if (!local.open && !allow_new) {
          local.select = item || null;

          local.search.input = item?.tag || item?.label || "";
        }
        return item;
      }

      const item = local.options.find((e) => e.value === value);
      return item;
    }),
    "value"
  );
  let inputval = local.search.input;

  if (!local.open && local.mode === "single" && local.value?.length > 0) {
    const found = options.find((e) => e.value === local.value[0]);
    if (found) {
      inputval = found.tag || found.label;
    } else {
      inputval = local.value[0];
    }
  }
  useEffect(() => {
    if (allow_new && local.open) {
      local.search.input = local.value[0];
      local.render();
    }
  }, [local.open]);

  return (
    <div className="flex flex-row flex-grow w-full relative">
      <div
        className={cx(
          allow_new
            ? "cursor-text"
            : local.mode === "single"
            ? "cursor-pointer"
            : "cursor-text",
          "text-black flex relative flex-wrap py-0 items-center w-full h-full flex-1 ",
          className
        )}
        onClick={() => {
          if (!disabled) input.current?.focus();
        }}
      >
        {local.mode === "multi" ? (
          <div
            className={cx(
              css`
                margin-top: 5px;
                margin-bottom: -3px;
                display: flex;
                flex-wrap: wrap;
              `
            )}
          >
            {valueLabel.map((e, idx) => {
              return (
                <Badge
                  key={idx}
                  variant={"outline"}
                  className={cx(
                    "space-x-1 mr-2 mb-2 bg-white",
                    !disabled &&
                      " cursor-pointer hover:bg-red-100 hover:border-red-100"
                  )}
                  onClick={(ev) => {
                    if (!disabled) {
                      ev.stopPropagation();
                      ev.preventDefault();
                      local.value = local.value.filter(
                        (val) => e?.value !== val
                      );
                      local.render();
                      input.current?.focus();

                      if (typeof onChange === "function") {
                        onChange(local.value);
                      }
                    }
                  }}
                >
                  <div className="text-xs">
                    {e?.tag || e?.label || <>&nbsp;</>}
                  </div>
                  {!disabled && <IoCloseOutline size={12} />}
                </Badge>
              );
            })}
          </div>
        ) : (
          <></>
        )}
        <TypeaheadOptions
          fitur={fitur}
          popup={true}
          onOpenChange={(open) => {
            if (!open) {
              local.select = null;
            }
            local.open = open;
            local.render();

            if (!open) {
              resetSearch();
            }
          }}
          onRemove={(data) => {
            local.value = local.value.filter((val) => data?.value !== val);
            local.render();
            input.current?.focus();

            if (typeof onChange === "function") {
              onChange(local.value);
            }
          }}
          onSelectAll={(data: boolean) => {
            local.value = data ? options.map((e) => e?.value) : [];
            local.render();
            input.current?.focus();
            if (typeof onChange === "function") {
              onChange(local.value);
            }
          }}
          init={local}
          isBetter={isBetter}
          loading={local.loading}
          showEmpty={!allow_new}
          className={popupClassName}
          open={local.open}
          options={options}
          searching={local.search.searching}
          searchText={local.search.input}
          onSearch={async (e) => {
            const val = e.currentTarget.value;
            if (!local.open) {
              local.open = true;
            }

            local.search.input = val;
            local.render();

            if (local.search.promise) {
              await local.search.promise;
            }

            local.search.searching = true;
            local.render();
            if (allow_new) {
              setSearchTerm(val);
            }
            if (local.search.searching) {
              if (local.local_search) {
                if (!local.loaded) {
                  await loadOptions();
                }
                const search = local.search.input.toLowerCase();
                if (search) {
                  local.search.result = options.filter((e) =>
                    e.label.toLowerCase().includes(search)
                  );

                  if (
                    local.search.result.length > 0 &&
                    !local.search.result.find(
                      (e) => e.value === local.select?.value
                    )
                  ) {
                  }
                } else {
                  local.search.result = null;
                }
                local.search.searching = false;
                local.render();
              } else {
                clearTimeout(local.search.timeout);
                local.search.timeout = setTimeout(async () => {
                  const result = options_fn?.({
                    search: local.search.input,
                    existing: options,
                  });
                  if (result) {
                    if (result instanceof Promise) {
                      local.search.promise = result;
                      local.search.result = (await result).map((item) => {
                        if (typeof item === "string")
                          return { value: item, label: item };
                        return item;
                      });
                      local.search.searching = false;
                      local.search.promise = null;
                    } else {
                      local.search.result = result.map((item) => {
                        if (typeof item === "string")
                          return { value: item, label: item };
                        return item;
                      });
                      local.search.searching = false;
                    }

                    if (
                      local.search.result.length > 0 &&
                      !local.search.result.find(
                        (e) => e.value === local.select?.value
                      )
                    ) {
                    }

                    local.render();
                  }
                }, 100);
              }
            }
          }}
          onSelect={(value) => {
            if (!isBetter) local.open = false;
            resetSearch();
            const item = options.find((item) => item.value === value);
            if (item) {
              let search = local.search.input;
              if (local.mode === "single") {
                local.search.input = item.tag || item.label;
              } else {
                local.search.input = "";
              }

              select({
                search,
                item,
              });
            }

            local.render();
          }}
          width={
            local.auto_popup_width ? input.current?.offsetWidth : undefined
          }
          isMulti={local.mode === "multi"}
          selected={({ item, options, idx }) => {
            // console.log(local.select);
            if (isBetter) {
              const val = local.value?.length ? local.value : [];
              let isSelect = options.find((e) => {
                return (
                  e?.value === item?.value &&
                  val.find((ex) => ex === item?.value)
                );
              });
              return isSelect ? true : false;
            } else if (item.value === local.select?.value) {
              return true;
            }

            return false;
          }}
        >
          <div
            className={cx(
              allow_new ? "cursor-text" : "cursor-pointer",
              "single flex-1 flex-grow flex flex-row"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                if (!local.open) {
                  if (local.on_focus_open) {
                    loadOptions();
                    local.open = true;
                    local.render();
                    // if (allow_new) {
                    //   local.search.input = inputval;
                    //   local.render();
                    // }
                  }
                }
                if (local.mode === "single") {
                  if (input && input.current) input.current.select();
                }
              }
            }}
          >
            {isBetter ? (
              <div className="h-9 flex-grow flex flex-row items-start">
                <div className="flex flex-grow"></div>
                <div className="h-9 flex flex-row items-center px-2">
                  <GoChevronDown size={14} />
                </div>
              </div>
            ) : (
              <input
                placeholder={
                  local.mode === "multi"
                    ? placeholder
                    : valueLabel[0]?.label || placeholder
                }
                type="text"
                ref={input}
                value={inputval}
                onChange={async (e) => {
                  const val = e.currentTarget.value;
                  if (!local.open) {
                    local.open = true;
                  }

                  local.search.input = val;
                  local.render();

                  if (local.search.promise) {
                    await local.search.promise;
                  }

                  local.search.searching = true;
                  local.render();
                  if (allow_new) {
                    setSearchTerm(val);
                  }
                  if (local.search.searching) {
                    if (local.local_search) {
                      if (!local.loaded) {
                        await loadOptions();
                      }
                      const search = local.search.input.toLowerCase();
                      if (search) {
                        local.search.result = options.filter((e) =>
                          e.label.toLowerCase().includes(search)
                        );

                        if (
                          local.search.result.length > 0 &&
                          !local.search.result.find(
                            (e) => e.value === local.select?.value
                          )
                        ) {
                          local.select = local.search.result[0];
                        }
                      } else {
                        local.search.result = null;
                      }
                      local.search.searching = false;
                      local.render();
                    } else {
                      clearTimeout(local.search.timeout);
                      local.search.timeout = setTimeout(async () => {
                        const result = options_fn?.({
                          search: local.search.input,
                          existing: options,
                        });
                        if (result) {
                          if (result instanceof Promise) {
                            local.search.promise = result;
                            local.search.result = (await result).map((item) => {
                              if (typeof item === "string")
                                return { value: item, label: item };
                              return item;
                            });
                            local.search.searching = false;
                            local.search.promise = null;
                          } else {
                            local.search.result = result.map((item) => {
                              if (typeof item === "string")
                                return { value: item, label: item };
                              return item;
                            });
                            local.search.searching = false;
                          }

                          if (
                            local.search.result.length > 0 &&
                            !local.search.result.find(
                              (e) => e.value === local.select?.value
                            )
                          ) {
                            local.select = local.search.result[0];
                          }

                          local.render();
                        }
                      }, 100);
                    }
                  }
                }}
                disabled={!disabled ? disabledSearch : disabled}
                spellCheck={false}
                className={cx(
                  "text-black flex h-9 w-full border-input bg-transparent px-3 py-1 text-base border-none shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm focus:outline-none focus:ring-0",
                  local.mode === "single" ? "cursor-pointer" : ""
                )}
                style={{
                  pointerEvents: disabledSearch ? "none" : "auto", // Mencegah input menangkap klik saat disabled
                }}
                onKeyDown={keydown}
              />
            )}
          </div>
        </TypeaheadOptions>
      </div>

      {local.mode === "single" && fitur !== "search-add" && (
        <>
          <div
            className={cx(
              "typeahead-arrow absolute z-10 inset-0 left-auto flex items-center ",
              " justify-center w-6 mr-1 my-2 bg-transparant",
              disabled ? "hidden" : "cursor-pointer"
            )}
            onClick={() => {
              if (!disabled) {
                local.value = [];
                local.render();
                if (typeof onChange === "function") onChange(local.value);
              }
            }}
          >
            {inputval ? <X size={14} /> : <GoChevronDown size={14} />}
          </div>
        </>
      )}
    </div>
  );
};
