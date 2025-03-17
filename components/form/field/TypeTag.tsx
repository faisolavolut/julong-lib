import { cva } from "class-variance-authority";
import { useRef, useState, useEffect } from "react";
import { Checkbox } from "../../ui/checkbox";
import { X } from "lucide-react";
import { IoIosRadioButtonOff } from "react-icons/io";

export const TypeTag: React.FC<any> = ({
  name,
  fm,
  placeholder,
  disabled = false,
  required,
  type,
  field,
  onChange,
  styleField,
}) => {
  const [tags, setTags] = useState<string[]>(fm.data?.[name] || []);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Index tag yang sedang diedit
  const [tempValue, setTempValue] = useState<string>(""); // Nilai sementara untuk pengeditan
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const val = fm?.data?.[name];

  useEffect(() => {
    if (editingIndex !== null && tagRefs.current[editingIndex]) {
      tagRefs.current[editingIndex]?.focus();
    }
  }, [editingIndex]);

  const handleSaveEdit = (index: number) => {
    if (disabled) return;
    const updatedTags = [...tags];
    updatedTags[index] = tempValue.trim(); // Update nilai tag
    setTags(updatedTags);
    setEditingIndex(null); // Keluar dari mode edit
    setTempValue(""); // Reset nilai sementara

    fm.data[name] = updatedTags;
    fm.render();
    if (typeof onChange === "function") {
      onChange(tags);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
    if (disabled) return;
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      e.stopPropagation();
      setTags([...tags, inputValue]);
      setInputValue("");
      fm.data[name] = [...tags, inputValue];
      fm.render();
      if (typeof onChange === "function") {
        onChange(tags);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleFocusTag = (index: number) => {
    if (disabled) return;
    setEditingIndex(index); // Masuk ke mode edit
    setTempValue(tags[index]); // Isi nilai sementara dengan nilai tag
  };

  const removeTag = (index: number) => {
    if (disabled) return;
    setTags(tags.filter((_, i) => i !== index));
  };

  const buttonVariants = cva(
    "flex flex-row items-center  rounded-full  text-sm p-1",
    {
      variants: {
        variant: {
          default: "bg-blue-100 text-blue-800 m-1",
          moe: "",
        },
      },
    }
  );
  const stylingGroup = ["checkbox", "radio", "order"];
  return (
    <div
      className={cx(
        "flex    rounded-md flex-grow ",
        stylingGroup.includes(styleField)
          ? "flex-wrap flex-col"
          : "items-center flex-wrap",
        disabled && !tags?.length ? "h-9" : ""
      )}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className={cx(
            buttonVariants({ variant: styleField ? styleField : "default" }),
            editingIndex === index
              ? styleField
                ? "border-b border-gray-500 rounded-none"
                : "bg-transparent border border-gray-500 rounded-full text-gray-900"
              : ""
          )}
        >
          {styleField === "checkbox" ? (
            <>
              <Checkbox
                className="border border-primary"
                checked={false}
                onClick={(e) => {}}
              />{" "}
            </>
          ) : styleField === "radio" ? (
            <>
              <IoIosRadioButtonOff />{" "}
            </>
          ) : styleField === "order" ? (
            <>
              {index + 1}
              {". "}
            </>
          ) : (
            <></>
          )}
          {disabled ? (
            <div className="px-2">{tag}</div>
          ) : (
            <div
              ref={(el) => {
                if (el) tagRefs.current[index] = el;
              }}
              className={cx(
                "px-3 py-1 pr-0 flex-grow  focus:shadow-none focus:ring-0	 focus:border-none focus:outline-none",
                editingIndex !== index && "cursor-pointer"
              )}
              contentEditable={editingIndex === index}
              suppressContentEditableWarning
              onBlur={() => handleSaveEdit(index)}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveEdit(index);
                }
                if (e.key === "Escape") {
                  setEditingIndex(null);
                }
              }}
              onClick={() => handleFocusTag(index)}
              onInput={(e) =>
                setTempValue((e.target as HTMLDivElement).innerText)
              }
            >
              {tag}
            </div>
          )}

          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2  text-red-500  pr-2"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      {!disabled && (
        <input
          type="text"
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-md flex-grow border-none outline-none text-sm focus:shadow-none focus:ring-0	 focus:border-none focus:outline-none"
          placeholder="Add a option..."
        />
      )}
    </div>
  );
};
