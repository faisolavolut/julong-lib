import { FC } from "react";

export const ButtonRichText: FC<any> = ({
  children,
  active,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        active ? "is-active bg-gray-200" : "",
        "text-black text-sm p-1 hover:bg-gray-200 rounded-md px-2 "
      )}
    >
      {children}
    </button>
  );
};
