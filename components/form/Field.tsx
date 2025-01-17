import { useEffect, useRef } from "react";
import { FieldCheckbox } from "./field/TypeCheckbox";
import { TypeDropdown } from "./field/TypeDropdown";
import { TypeInput } from "./field/TypeInput";
import { TypeUpload } from "./field/TypeUpload";
import { FieldUploadMulti } from "./field/TypeUploadMulti";
import { TypeRichText } from "./field/TypeRichText";
import { TypeTag } from "./field/TypeTag";
import get from "lodash.get";
import { getNumber } from "@/lib/utils/getNumber";

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
  prefix,
  suffix,
}) => {
  let result = null;

  const suffixRef = useRef<HTMLDivElement | null>(null);
  const prefixRef = useRef<HTMLDivElement | null>(null);
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
  const before = typeof prefix === "function" ? prefix() : prefix;
  const after = typeof suffix === "function" ? suffix() : suffix;
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
              ? "flex flex-row rounded-md flex-grow border-red-500 border items-center"
              : "flex flex-row rounded-md flex-grow  items-center",
            is_disable ? "bg-gray-100" : "",
            "relative"
          )}
        >
          {before && (
            <div
              ref={prefixRef}
              className={cx(
                "absolute left-[1px] px-1 py-1 bg-gray-200/50  border  border-gray-100 items-center flex flex-row flex-grow rounded-l-md",
                css`
                  height: 2.13rem;
                  top: 50%;
                  transform: translateY(-50%);
                `,
                is_disable ? "bg-gray-100" : "bg-gray-200/50"
              )}
            >
              {before}
            </div>
          )}
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
          ) : ["richtext"].includes(type) ? (
            <>
              <TypeRichText
                fm={fm}
                name={name}
                disabled={is_disable}
                className={className}
              />
            </>
          ) : ["tag"].includes(type) ? (
            <>
              <TypeTag
                fm={fm}
                name={name}
                disabled={is_disable}
                className={className}
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
                className={cx(
                  before &&
                    css`
                      padding-left: ${getNumber(
                        get(prefixRef, "current.clientWidth")
                      ) + 10}px;
                    `,
                  after &&
                    css`
                      padding-right: ${getNumber(
                        get(suffixRef, "current.clientWidth")
                      ) + 10}px;
                    `
                )}
              />
            </>
          )}
          {after && (
            <div
              ref={suffixRef}
              className={cx(
                "absolute right-[1px] px-1 py-1    items-center flex flex-row flex-grow rounded-r-md",
                css`
                  height: 2.13rem;
                  top: 50%;
                  transform: translateY(-50%);
                `,
                is_disable
                  ? "bg-gray-200/50 border-l border-gray-300"
                  : "bg-gray-200/50 border  border-gray-100"
              )}
            >
              {after}
            </div>
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
