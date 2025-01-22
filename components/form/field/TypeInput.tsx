import { useLocal } from "@/lib/utils/use-local";
import Datepicker from "../../ui/Datepicker";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/text-area";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { FieldColorPicker } from "../../ui/FieldColorPopover";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { Rating } from "../../ui/ratings";
import { getNumber } from "@/lib/utils/getNumber";

export const TypeInput: React.FC<any> = ({
  name,
  fm,
  placeholder,
  disabled = false,
  required,
  type,
  field,
  onChange,
  className,
}) => {
  const [hover, setHover] = useState(0); // State untuk menyimpan nilai hover

  let value: any = fm.data?.[name] || "";
  const [rating, setRating] = useState(value); // State untuk menyimpan nilai rating
  const handleClick = (index: number) => {
    setRating(index); // Update nilai rating
    fm.data[name] = rating + 1;
    fm.render();
  };
  const input = useLocal({
    value: 0 as any,
    ref: null as any,
    open: false,
  });
  const meta = useLocal({
    originalValue: "",
    inputValue: value,
    rgbValue: "",
    selectedEd: "" as string,
  });
  useEffect(() => {
    if (type === "color") {
      meta.inputValue = value || "";
      const convertColor = tinycolor(meta.inputValue);
      meta.rgbValue = convertColor.toRgbString();
      meta.render();
    } else {
      setRating(value ? value - 1 : value);
    }
  }, [value]);
  useEffect(() => {
    if (type === "money") {
      input.value =
        typeof fm.data?.[name] === "number" && fm.data?.[name] === 0
          ? "0"
          : formatCurrency(value);
      input.render();
    }
  }, [fm.data?.[name]]);
  const error = fm.error?.[name];
  switch (type) {
    case "textarea":
      return (
        <>
          <Textarea
            id={name}
            name={name}
            disabled={disabled}
            required={required}
            className={cx(
              "text-sm border-none",
              css`
                background-color: ${disabled
                    ? "rgb(243 244 246)"
                    : "transparant"}
                  ? "";
              `
            )}
            placeholder={placeholder || ""}
            value={value}
            onChange={(ev) => {
              fm.data[name] = ev.currentTarget.value;
              fm.render();

              if (typeof onChange === "function") {
                onChange(fm.data[name]);
              }
            }}
          />
        </>
      );
      break;

    case "rating":
      return (
        <div className="flex">
          <Rating
            rating={getNumber(fm.data?.[name])}
            totalStars={5}
            size={24}
            variant="yellow"
            disabled={disabled}
            className="h-1"
            showText={false}
            onRatingChange={(e) => {
              fm.data[name] = getNumber(e);
              fm.render();
              if (typeof onChange === "function") {
                onChange(fm.data[name]);
              }
            }}
          />
        </div>
      );
      return (
        <>
          <div className="flex">
            {Array.from({ length: 5 }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick(number);
                  }}
                  onMouseEnter={() => setHover(number)} // Set nilai hover saat mouse masuk
                  onMouseLeave={() => setHover(number)} // Reset nilai hover saat mouse keluar
                  className={cx(
                    "focus:outline-none px-0.5",
                    disabled ? "" : "transition-transform duration-200"
                  )}
                  style={{
                    transform:
                      hover === number && !disabled ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  {hover >= number || rating >= number ? (
                    <FaStar className="text-yellow-400" /> // Star yang diisi (fill)
                  ) : (
                    <FaRegStar className="text-gray-400" /> // Star yang kosong (outline)
                  )}
                </button>
              )
            )}
          </div>
        </>
      );
      break;
    case "color":
      return (
        <div className="flex flex-row items-center">
          <div className="border border-gray-300 p-0.5 rounded-sm">
            <FieldColorPicker
              value={fm.data?.[name]}
              update={(val) => {
                fm.data[name] = val;
                fm.render();
                if (typeof onChange === "function") {
                  onChange(fm.data[name]);
                }
              }}
              onOpen={() => {
                input.open = true;
                input.render();
              }}
              onClose={() => {
                input.open = false;
                input.render();
              }}
              open={input.open}
              showHistory={false}
            >
              <div
                className={cx(
                  css`
                    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>');
                  `,
                  "cursor-pointer  rounded-md"
                )}
              >
                <div
                  className={cx(
                    "rounded-sm h-8 w-8",
                    css`
                      background: ${fm?.data?.[name]};
                    `,
                    "color-box"
                  )}
                ></div>
              </div>
            </FieldColorPicker>
          </div>
        </div>
      );
      break;

    case "date":
      return (
        <>
          <Datepicker
            value={{ startDate: value, endDate: value }}
            disabled={disabled}
            displayFormat="DD MMM YYYY"
            mode={"daily"}
            maxDate={field?.max_date instanceof Date ? field.max_date : null}
            minDate={field?.min_date instanceof Date ? field.min_date : null}
            asSingle={true}
            useRange={false}
            onChange={(value) => {
              fm.data[name] = value?.startDate
                ? new Date(value?.startDate)
                : null;
              fm.render();
              if (typeof onChange === "function") {
                onChange(fm.data[name]);
              }
            }}
          />
        </>
      );
      break;
    case "money":
      return (
        <>
          <Input
            id={name}
            name={name}
            disabled={disabled}
            className={cx(
              "text-sm text-right	",
              error
                ? css`
                    border-color: red !important;
                  `
                : ``,
              css`
                background-color: ${disabled
                    ? "rgb(243 244 246)"
                    : "transparant"}
                  ? "";
              `,
              className
            )}
            required={required}
            placeholder={placeholder || ""}
            value={formatCurrency(input.value)}
            type={"text"}
            onChange={(ev) => {
              const rawValue = ev.currentTarget.value
                .replace(/[^0-9,-]/g, "")
                .toString();
              if (rawValue === "0") {
                input.value = "0";
                input.render();
              }
              if (
                (!rawValue.startsWith(",") || !rawValue.endsWith(",")) &&
                !rawValue.endsWith("-") &&
                convertionCurrencyNumber(rawValue) !==
                  convertionCurrencyNumber(input.value)
              ) {
                fm.data[name] = convertionCurrencyNumber(
                  formatCurrency(rawValue)
                );
                fm.render();
                if (typeof onChange === "function") {
                  onChange(fm.data[name]);
                }
                input.value = formatCurrency(fm.data[name]);
                input.render();
              } else {
                input.value = rawValue;
                input.render();
              }
            }}
          />
        </>
      );
      break;
  }
  return (
    <>
      <Input
        id={name}
        name={name}
        className={cx(
          "text-sm",
          error
            ? css`
                border-color: red !important;
              `
            : ``,
          css`
            background-color: ${disabled ? "rgb(243 244 246)" : "transparant"} ?
              "";
          `,
          className
        )}
        disabled={disabled}
        required={required}
        placeholder={placeholder || ""}
        value={value}
        type={!type ? "text" : type}
        onChange={(ev) => {
          fm.data[name] = ev.currentTarget.value;
          fm.render();
          if (typeof onChange === "function") {
            onChange(fm.data[name]);
          }
        }}
      />
    </>
  );
};
const convertionCurrencyNumber = (value: string) => {
  if (!value) return null;
  let numberString = value.toString().replace(/[^0-9,-]/g, "");
  if (numberString.endsWith(",")) {
    return Number(numberString.replace(",", "")) || 0;
  }
  if (numberString.endsWith("-")) {
    return Number(numberString.replace("-", "")) || 0;
  }
  const rawValue = numberString.replace(/[^0-9,-]/g, "").replace(",", ".");
  return parseFloat(rawValue) || 0;
};
const formatCurrency = (value: any) => {
  // Menghapus semua karakter kecuali angka, koma, dan tanda minusif (value === null || value === undefined) return '';
  if (typeof value === "number" && value === 0) return "0";
  if (typeof value === "string" && value === "0") return "0";
  if (!value) return "";
  let numberString = "";
  if (typeof value === "number") {
    numberString = formatMoney(value);
  } else {
    numberString = value.toString().replace(/[^0-9,-]/g, "");
  }
  if (numberString.endsWith("-") && numberString.startsWith("-")) {
    return "-";
  } else if (numberString.endsWith(",")) {
    const isNegative = numberString.startsWith("-");
    numberString = numberString.replace("-", "");
    const split = numberString.split(",");
    if (isNumberOrCurrency(split[0]) === "Number") {
      split[0] = formatMoney(Number(split[0]));
    }
    let rupiah = split[0];
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return (isNegative ? "-" : "") + rupiah;
  } else {
    const isNegative = numberString.startsWith("-");
    numberString = numberString.replace("-", "");
    const split = numberString.split(",");
    if (isNumberOrCurrency(split[0]) === "Number") {
      split[0] = formatMoney(Number(split[0]));
    }
    let rupiah = split[0];
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return (isNegative ? "-" : "") + rupiah;
  }
};
export const formatMoney = (res: any) => {
  if (typeof res === "string" && res.startsWith("BigInt::")) {
    res = res.substring(`BigInt::`.length);
  }

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(res);
  return formattedAmount;
};
const isNumberOrCurrency = (input: any) => {
  // Pengecekan apakah input adalah angka biasa

  if (typeof input === "string") {
    let rs = input;
    if (input.startsWith("-")) {
      rs = rs.replace("-", "");
    }
    const dots = rs.match(/\./g);
    if (dots && dots.length > 1) {
      return "Currency";
    } else if (dots && dots.length === 1) {
      if (!hasNonZeroDigitAfterDecimal(rs)) {
        return "Currency";
      }
      return "Currency";
    }
  }
  if (!isNaN(input)) {
    return "Number";
  }
  // Pengecekan apakah input adalah format mata uang dengan pemisah ribuan
  const currencyRegex = /^-?Rp?\s?\d{1,3}(\.\d{3})*$/;
  if (currencyRegex.test(input)) {
    return "Currency";
  }

  // Jika tidak terdeteksi sebagai angka atau format mata uang, kembalikan null atau sesuai kebutuhan
  return null;
};
const hasNonZeroDigitAfterDecimal = (input: string) => {
  // Ekspresi reguler untuk mencocokkan angka 1-9 setelah koma atau titik
  const regex = /[.,]\d*[1-9]\d*/;
  return regex.test(input);
};
