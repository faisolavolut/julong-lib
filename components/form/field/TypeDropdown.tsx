import { useLocal } from "@/lib/utils/use-local";
import { Typeahead } from "./Typeahead";
import { useEffect } from "react";

export const TypeDropdown: React.FC<any> = ({
  required,
  fm,
  name,
  onLoad,
  onChange,
  placeholder,
  disabled,
  mode,
}) => {
  return (
    <>
      <Typeahead
        value={
          Array.isArray(fm.data?.[name])
            ? fm.data?.[name]
            : fm.data?.[name]
            ? [fm.data?.[name]]
            : []
        }
        allowNew={true}
        unique={false}
        disabledSearch={false}
        //   popupClassName={}
        fitur="search-add"
        required={required}
        onSelect={({ search, item }) => {
          if (item) {
            if (mode === "multi") {
              if (!Array.isArray(fm.data[name])) {
                fm.data[name] = [];
                fm.render();
              }
              fm.data[name].push(item.value);
              fm.render();
            } else {
              fm.data[name] = item.value;
              fm.render();
            }
          }
          if (typeof onChange === "function" && item) {
            onChange(item);
          }
          console.log(fm.data[name]);
          return item?.value || search;
        }}
        disabled={disabled}
        // allowNew={false}
        autoPopupWidth={true}
        focusOpen={true}
        mode={mode ? mode : "single"}
        placeholder={placeholder}
        options={onLoad}
        onInit={(e) => {
          fm.fields[name] = {
            ...fm.fields[name],
            ...e,
          };
        }}
      />
    </>
  );
};
