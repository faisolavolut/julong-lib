import React, { useRef, useState } from "react";

interface MaskedInputProps {
  value: string;
  onChange: (value: any) => void;
  disabled?: boolean;
  className?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Referensi ke elemen input
  const [localValue, setLocalValue] = useState<string>(value); // State lokal untuk kontrol input

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    let input = e.target.value;

    // Hapus semua karakter non-digit
    input = input.replace(/\D/g, "");

    // Format ke dalam bentuk HH:mm dengan padding underscore
    if (input.length === 1) {
      input = input + "_:__"; // Jika 1 angka
    } else if (input.length === 2) {
      input = input + ":__"; // Jika 2 angka
    } else if (input.length > 2) {
      input = input.substring(0, 2) + ":" + input.substring(2, 4);
      if (input.length < 5) {
        input = input.padEnd(5, "_"); // Tambahkan underscore untuk padding
      }
    }

    // Batasi panjang maksimum
    if (input.length > 5) {
      input = input.substring(0, 5);
    }

    // Update state lokal
    setLocalValue(input);

    // Panggil `onChange` jika input lengkap (tanpa underscore) atau jika input kosong
    if (input.length === 5 && !input.includes("_")) {
      onChange(input); // Input lengkap
    } else if (input === "__:__" || input === "") {
      onChange(null); // Input kosong
    }

    // Atur posisi kursor
    if (inputRef.current) {
      const caretPosition = Math.max(
        input.indexOf("_") !== -1 ? input.indexOf("_") : input.length,
        0
      );
      let caret = caretPosition === 3 ? 2 : caretPosition;
      setTimeout(() => {
        inputRef.current?.setSelectionRange(caret, caret);
      }, 0);
    }
  };

  return (
    <input
      ref={inputRef}
      id="time"
      type="text"
      value={localValue}
      disabled={disabled}
      onChange={handleInputChange}
      placeholder={disabled ? "" : "__:__"}
      className={cx(
        "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500",
        className
      )}
    />
  );
};

export default MaskedInput;
