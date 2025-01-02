import get from "lodash.get";
import { Loader2, Paperclip, Trash2, Upload } from "lucide-react";
import { ChangeEvent, FC } from "react";
import * as XLSX from "xlsx";
import { useLocal } from "@/lib/utils/use-local";
import { siteurl } from "@/lib/utils/siteurl";
import { FilePreview } from "./FilePreview";

export const FieldUploadSingle: FC<{
  field: any;
  fm: any;
  on_change: (e: any) => void | Promise<void>;
  mode?: "upload" | "import";
}> = ({ field, fm, on_change, mode }) => {
  const styling = "mini";
  const disabled = field?.disabled || false;
  let value: any = fm.data?.[field.name];
  // let type_upload =
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
    drop: false as boolean,
    fase: value ? "preview" : ("start" as "start" | "upload" | "preview"),
    style: "inline" as "inline" | "full",
  });

  const on_upload = async (event: ChangeEvent<HTMLInputElement>) => {
    let file = null;
    try {
      file = event.target?.files?.[0];
    } catch (ex) {}
    if (mode === "import") {
      const reader = new FileReader();

      function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        return String.fromCharCode.apply(null, Array.from(bytes));
      }

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const binaryStr =
            typeof e.target.result === "string"
              ? e.target.result
              : arrayBufferToBinaryString(e.target.result);
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          if (typeof on_change === "function") {
            on_change({
              value: jsonData,
              file: file,
              binnary: e.target.result,
            });
          }
        }
      };
      if (file) {
        if (typeof reader.readAsArrayBuffer === "function") {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsBinaryString(file);
        }
      }
    } else if (file) {
      const formData = new FormData();
      formData.append("file", file);

      let url = siteurl("/_upload");
      if (
        location.hostname === "prasi.avolut.com" ||
        location.host === "localhost:4550"
      ) {
        const newurl = new URL(location.href);
        newurl.pathname = `/_proxy/${url}`;
        url = newurl.toString();
      }
      input.fase = "upload";
      input.render();
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const contentType: any = response.headers.get("content-type");
          let result;
          if (contentType.includes("application/json")) {
            result = await response.json();
          } else if (contentType.includes("text/plain")) {
            result = await response.text();
          } else {
            result = await response.blob();
          }
          if (Array.isArray(result)) {
            fm.data[field.name] = `_file${get(result, "[0]")}`;
            fm.render();
            setTimeout(() => {
              input.fase = "preview";
              input.render();
            }, 1000);
          } else {
            input.fase = "start";
            input.render();
            alert("Error upload");
          }
        } else {
        }
      } catch (ex) {
        input.fase = "start";
        input.render();
        alert("Error upload");
      }
    }
    if (input.ref) {
      input.ref.value = null;
    }
  };

  return (
    <div className="flex-grow flex-row flex w-full h-full items-stretch relative">
      {input.fase === "start" ? (
        <>
          <div
            className={cx(
              "bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500",
              css`
                input[type="file"],
                input[type="file"]::-webkit-file-upload-button {
                  cursor: pointer;
                }
              `
            )}
          >
            {!disabled && (
              <input
                ref={(ref) => {
                  if(ref) input.ref = ref
                }}
                type="file"
                multiple={false}
                // accept={field.prop.upload?.accept}
                accept={"file/**"}
                onChange={on_upload}
                className={cx(
                  "absolute w-full h-full cursor-pointer top-0 left-0 opacity-0"
                )}
              />
            )}

            <div
              onClick={() => {
                if (input.ref) {
                  input.ref.click();
                }
              }}
              className="items-center flex text-base px-1 outline-none rounded cursor-pointer "
            >
              <div className="flex flex-row items-center px-2">
                <Upload className="h-4 w-4" />
              </div>
              <div className="flex flex-row items-center  text-md">
                Upload File
              </div>
            </div>
          </div>
        </>
      ) : input.fase === "upload" ? (
        <div className="flex items-center">
          <div className="px-2">
            <Loader2 className={cx("h-5 w-5 animate-spin")} />
          </div>
          <div className="">Uploading</div>
        </div>
      ) : input.fase === "preview" ? (
        <div className="flex justify-between flex-1 p-1">
          <FilePreview url={value || ""} />
          {!disabled ? (
            <>
              <div
                onClick={(e) => {
                  if (!disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm("Clear this file ?")) {
                      input.fase = "start";
                      fm.data[field.name] = null;
                      fm.render();
                    }
                  }
                }}
                className={cx(
                  "flex flex-row items-center border px-2 rounded cursor-pointer hover:bg-red-100"
                )}
              >
                <Trash2 className="text-red-500 h-4 w-4" />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const IconFile: FC<{ type: string }> = ({ type }) => {
  if (["xlsx"].includes(type)) {
    return (
      <div className="flex flex-row text-[#2a801d]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.494v20.848a.5.5 0 0 1-.57.494L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4zm-6.8 9L13 8h-2.4L9 10.286L7.4 8H5l2.8 4L5 16h2.4L9 13.714L10.6 16H13z"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row ">
        <Paperclip className="h-5 w-5" />
      </div>
    );
  }
};
