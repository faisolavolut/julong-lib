import React, { useCallback, useContext } from "react";

import { BG_COLOR, BORDER_COLOR, BUTTON_COLOR, RING_COLOR } from "../constants";
import DatepickerContext from "../contexts/DatepickerContext";

interface IconProps {
  className: string;
}

interface Button {
  children: JSX.Element | JSX.Element[];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  roundedFull?: boolean;
  padding?: string;
  active?: boolean;
  style?: string;
  className?: string;
}

export const DateIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
      />
    </svg>
  );
};

export const CloseIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = ({
  className = "w-6 h-6",
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
};

export const DoubleChevronLeftIcon: React.FC<IconProps> = ({
  className = "w-6 h-6",
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
      />
    </svg>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = ({
  className = "w-6 h-6",
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export const DoubleChevronRightIcon: React.FC<IconProps> = ({
  className = "w-6 h-6",
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export const SecondaryButton: React.FC<Button> = ({
  children,
  onClick,
  disabled = false,
}) => {
  // Contexts
  const { primaryColor } = useContext(DatepickerContext);

  // Functions
  const getClassName: () => string = useCallback(() => {
    const ringColor =
      RING_COLOR.focus[primaryColor as keyof typeof RING_COLOR.focus];
    return ` w-full transition-all duration-300 bg-gray-50 font-medium border border-gray-300 px-4 py-2.5 text-md rounded-md focus:ring-2 focus:ring-offset-2 hover:bg-gray-50 ${ringColor}`;
  }, [primaryColor]);

  return (
    <button
      type="button"
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const PrimaryButton: React.FC<Button> = ({
  children,
  onClick,
  disabled = false,
}) => {
  // Contexts
  const { primaryColor } = useContext(DatepickerContext);
  const bgColor =
    BG_COLOR["500"][primaryColor as keyof (typeof BG_COLOR)["500"]];
  const borderColor =
    BORDER_COLOR["500"][primaryColor as keyof (typeof BORDER_COLOR)["500"]];
  const bgColorHover =
    BG_COLOR.hover[primaryColor as keyof typeof BG_COLOR.hover];
  const ringColor =
    RING_COLOR.focus[primaryColor as keyof typeof RING_COLOR.focus];

  // Functions
  const getClassName = useCallback(() => {
    return ` w-full transition-all duration-300 ${bgColor} ${borderColor} text-white font-medium border px-4 py-2 text-md rounded-md focus:ring-2 focus:ring-offset-2 ${bgColorHover} ${ringColor} ${
      disabled ? " cursor-no-drop" : ""
    }`;
  }, [bgColor, bgColorHover, borderColor, disabled, ringColor]);

  return (
    <button
      type="button"
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const RoundedButton: React.FC<Button> = ({
  children,
  onClick,
  disabled,
  roundedFull = false,
  padding = "",
  active = false,
  style,
  className = "rounded-full",
}) => {
  // Contexts
  const { primaryColor } = useContext(DatepickerContext);

  // Functions
  const getClassName = useCallback(() => {
    const darkClass = "";
    const activeClass = active ? "font-semibold bg-gray-50 " : "";
    const defaultClass = !roundedFull
      ? `w-full tracking-wide ${darkClass} ${activeClass} transition-all duration-300 ${
          style === "custom" ? "px-2" : "uppercase p-[0.45rem] py-[0.55rem]"
        } hover:bg-gray-100 focus:ring-1`
      : `${darkClass} ${activeClass} transition-all duration-300 hover:bg-gray-100  focus:ring-1`;
    const buttonFocusColor =
      BUTTON_COLOR.focus[primaryColor as keyof typeof BUTTON_COLOR.focus];
    const disabledClass = disabled ? "line-through" : "";

    return `${defaultClass} ${buttonFocusColor} ${disabledClass} ${className}`;
  }, [disabled, padding, primaryColor, roundedFull, active]);

  return (
    <button
      type="button"
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const VerticalDash = () => {
  // Contexts
  const { primaryColor } = useContext(DatepickerContext);
  const bgColor =
    BG_COLOR["500"][primaryColor as keyof (typeof BG_COLOR)["500"]];

  return (
    <div
      className={`bg-blue-500 h-7 w-1 rounded-full hidden md:block ${bgColor}`}
    />
  );
};
