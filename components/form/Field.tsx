import { useEffect } from "react";
import { FieldCheckbox } from "./field/TypeCheckbox";
import { TypeDropdown } from "./field/TypeDropdown";
import { TypeInput } from "./field/TypeInput";
import { TypeUpload } from "./field/TypeUpload";
import { FieldUploadMulti } from "./field/TypeUploadMulti";

export const Field: React.FC<any> = ({
  fm,
  label,
  name,
  onLoad,
  type,
  placeholder,
  required,
  disabled,
  hidden_label,
  onChange,
  className,
  style,
}) => {
  let result = null;
  const is_disable = fm.mode === "view" ? true : disabled;
  const error = fm.error?.[name];
  useEffect(() => {
    if (typeof fm.fields?.[name] !== "object") {
      const fields = fm.fields?.[name];
      fm.fields[name] = {
        ...fields,
        label,
        name,
        onLoad,
        type,
        placeholder,
        required,
        disabled,
        hidden_label,
        onChange,
        className,
        style,
      };
      fm.render();
    }
  }, []);
  return (
    <>
      <div
        className={cx(
          "flex",
          style === "inline" ? "flex-row gap-x-1" : "flex-col"
        )}
      >
        {!hidden_label ? (
          <label
            className={cx(
              "block mb-2 text-md font-medium text-gray-900  text-sm",
              style === "inline" ? "w-[100px]" : ""
            )}
          >
            {label}
          </label>
        ) : (
          <></>
        )}
        <div
          className={cx(
            error
              ? "flex flex-row rounded-md flex-grow border-red-500 border"
              : "flex flex-row rounded-md flex-grow",
            is_disable ? "bg-gray-100" : ""
          )}
        >
          {["upload"].includes(type) ? (
            <>
              <TypeUpload
                fm={fm}
                name={name}
                on_change={onChange}
                mode={"upload"}
              />
            </>
          ) : ["multi-upload"].includes(type) ? (
            <>
              <TypeUpload
                fm={fm}
                name={name}
                on_change={onChange}
                mode={"upload"}
                type="multi"
              />
            </>
          ) : ["dropdown"].includes(type) ? (
            <>
              <TypeDropdown
                fm={fm}
                required={required}
                name={name}
                onLoad={onLoad}
                placeholder={placeholder}
                disabled={is_disable}
                onChange={onChange}
              />
            </>
          ) : ["multi-dropdown"].includes(type) ? (
            <>
              <TypeDropdown
                fm={fm}
                required={required}
                name={name}
                onLoad={onLoad}
                placeholder={placeholder}
                disabled={is_disable}
                onChange={onChange}
                mode="multi"
              />
            </>
          ) : ["checkbox"].includes(type) ? (
            <>
              <FieldCheckbox
                fm={fm}
                name={name}
                onLoad={onLoad}
                placeholder={placeholder}
                disabled={is_disable}
                on_change={onChange}
                className={className}
              />
            </>
          ) : ["single-checkbox"].includes(type) ? (
            <>
              <FieldCheckbox
                fm={fm}
                name={name}
                onLoad={onLoad}
                placeholder={placeholder}
                disabled={is_disable}
                on_change={onChange}
                className={className}
                mode="single"
              />
            </>
          ) : (
            <>
              <TypeInput
                fm={fm}
                name={name}
                placeholder={placeholder}
                required={required}
                type={type}
                disabled={is_disable}
                onChange={onChange}
              />
            </>
          )}
        </div>
        {error ? (
          <div className="text-sm text-red-500 py-1">{error}</div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
