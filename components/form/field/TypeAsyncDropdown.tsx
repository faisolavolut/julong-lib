import { AsyncPaginate } from "react-select-async-paginate";
import { components } from "react-select";

export const TypeAsyncDropdown: React.FC<any> = ({
  name,
  fm,
  on_change,
  disabled,
  onValue,
  onLabel,
  onLoad,
  placeholder = "Select...",
}) => {
  const loadOptions = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    const result: any = await onLoad({
      paging: page,
      take: 10,
      search: searchQuery,
    });
    const responseJSON = result;
    return {
      options: responseJSON,
      hasMore: responseJSON.length >= 1,
      additional: {
        page: searchQuery ? 2 : page + 1,
      },
    };
  };

  const MultiValue = (props: any) => {
    return (
      <components.MultiValue
        {...props}
        className={cx(
          "selected-multi-value rounded-lg  bg-gray-200 ",
          css`
            border-radius: 6px !important;
          `
        )}
      >
        {props.children}
      </components.MultiValue>
    );
  };
  const Option = (props: any) => {
    const { data, isSelected, isFocused } = props;
    console.log({ data, isSelected, isFocused, props });
    return (
      <components.Option
        {...props}
        className={cx(
          `pointer-events-auto opt-item px-3 py-1 cursor-pointer option-item text-xs hover:bg-blue-50 ${
            isSelected ? "selected" : ""
          } ${isFocused ? "focused" : ""}`,
          "border-t"
        )}
        style={{
          fontSize: "0.875rem",
          cursor: "pointer",
        }}
      >
        {onLabel(data)}
      </components.Option>
    );
  };
  return (
    <AsyncPaginate
      placeholder={placeholder}
      isDisabled={disabled}
      className={cx(
        "rounded-md border-none",
        css`
          input:focus {
            outline: 0px !important;
            border: 0px !important;
            outline-offset: 0px !important;
            --tw-ring-color: transparent !important;
          }
          .css-13cymwt-control {
            border-color: transparent;
            border-width: 0px;
            border-radius: 6px;
          }
          .css-t3ipsp-control {
            border-color: transparent;
            border-width: 0px;
            box-shadow: none;
            border-radius: 6px;
          }
        `
      )}
      getOptionValue={onValue}
      getOptionLabel={onLabel}
      value={fm.data[name]}
      components={{ MultiValue, Option }}
      loadOptions={loadOptions}
      isSearchable={true}
      isMulti
      closeMenuOnSelect={false}
      onChange={(e) => {
        fm.data[name] = e;
        fm.render();
      }}
      additional={{
        page: 1,
      }}
    />
  );
};
