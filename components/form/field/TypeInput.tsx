import { useLocal } from "@/lib/utils/use-local";
import Datepicker from "../../ui/Datepicker";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/text-area";
import { useEffect } from "react";

export const TypeInput: React.FC<any> = ({
  name,
  fm,
  placeholder,
  disabled = false,
  required,
  type,
  field,
  onChange,
}) => {
  let value: any = fm.data?.[name] || "";
  const input = useLocal({
    value: 0 as any,
    ref: null as any,
  });
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
              "text-sm",
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
              `
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
          `
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
