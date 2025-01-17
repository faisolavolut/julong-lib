import { useLocal } from "@/lib/utils/use-local";
import { Input } from "../../ui/input";
import { useEffect, useRef, useState } from "react";
import {
  useEditor,
  EditorContent,
  useCurrentEditor,
  EditorProvider,
} from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Popover } from "../../Popover/Popover";
import { ButtonBetter } from "../../ui/button";
import get from "lodash.get";

export const TypeTag: React.FC<any> = ({
  name,
  fm,
  placeholder,
  disabled = false,
  required,
  type,
  field,
  onChange,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Index tag yang sedang diedit
  const [tempValue, setTempValue] = useState<string>(""); // Nilai sementara untuk pengeditan
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (get(fm, `data.[${name}].length`)) {
      setTags(fm.data?.[name]);
    }
  }, []);
  useEffect(() => {
    fm.data[name] = tags;
    fm.render();
  }, [inputValue]);
  const handleSaveEdit = (index: number) => {
    if (!disabled) return;
    const updatedTags = [...tags];
    updatedTags[index] = tempValue.trim(); // Update nilai tag
    setTags(updatedTags);
    setEditingIndex(null); // Keluar dari mode edit
    setTempValue(""); // Reset nilai sementara
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled) return;
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      setTags([...tags, inputValue]);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };
  const handleFocusTag = (index: number) => {
    if (!disabled) return;
    setEditingIndex(index); // Masuk ke mode edit
    setTempValue(tags[index]); // Isi nilai sementara dengan nilai tag
    setTimeout(() => {
      tagRefs.current[index]?.focus(); // Fokus pada elemen yang diedit
    }, 0);
  };
  const removeTag = (index: number) => {
    if (!disabled) return;
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center border border-gray-300 rounded-md flex-grow ">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex flex-row items-center bg-blue-100 text-blue-800 rounded-full m-1 text-sm"
        >
          {disabled ? (
            <div className="px-2">{tag}</div>
          ) : (
            <div
              className={cx(
                "px-3 py-1 pr-0 flex-grow  focus:shadow-none focus:ring-0	 focus:border-none focus:outline-none",
                editingIndex! !== index && "cursor-pointer"
              )}
              contentEditable={editingIndex === index}
              suppressContentEditableWarning
              onBlur={() => handleSaveEdit(index)}
              onKeyDown={(e) => {
                if (!disabled) return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSaveEdit(index);
                }
                if (e.key === "Escape") {
                  setEditingIndex(null);
                }
              }}
              onClick={() => {
                handleFocusTag(index);
              }}
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
              className="ml-2 text-blue-500 hover:text-blue-700 pr-2"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      {!disabled && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-md flex-grow border-none outline-none text-sm focus:shadow-none focus:ring-0	 focus:border-none focus:outline-none"
          placeholder="Add a option..."
        />
      )}
    </div>
  );
};
