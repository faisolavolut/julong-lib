import { TypeaheadBetter } from "./TypeaheadBetter";

export const TypeDropdownBetter: React.FC<any> = ({
  required,
  fm,
  name,
  onLoad,
  onChange,
  placeholder,
  disabled,
  mode,
  allowNew = false,
  unique = true,
  isBetter = false,
  onCount,
  onLabel,
}) => {
  return (
    <>
      <TypeaheadBetter
        value={
          Array.isArray(fm.data?.[name])
            ? fm.data?.[name]
            : fm.data?.[name]
            ? [fm.data?.[name]]
            : []
        }
        onCount={onCount}
        onLoad={onLoad}
        onLabel={onLabel}
        isBetter={isBetter}
        allowNew={allowNew}
        unique={mode === "multi" ? (isBetter ? false : true) : false}
        disabledSearch={false}
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
