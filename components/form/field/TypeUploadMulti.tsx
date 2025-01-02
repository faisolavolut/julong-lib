import get from "lodash.get";
import { Loader2, Paperclip, Trash2, Upload } from "lucide-react";
import { ChangeEvent, FC } from "react";
import * as XLSX from "xlsx";
import { useLocal } from "@/lib/utils/use-local";
import { siteurl } from "@/lib/utils/siteurl";
import { FilePreview } from "./FilePreview";
import { Spinner } from "../../ui/spinner";

export const FieldUploadMulti: FC<{
  field: any;
  fm: any;
  on_change: (e: any) => void | Promise<void>;
  mode?: "upload";
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
    uploading: new Set<File>(),
    fase: value ? "preview" : ("start" as "start" | "upload" | "preview"),
    style: "inline" as "inline" | "full",
  });

  const on_upload = async (event: ChangeEvent<HTMLInputElement>) => {
    let file = null;
    try {
      file = event.target?.files?.[0];
    } catch (ex) {}
    const upload_single = async (file: File) => {
      return { url: `/dog.jpg` };
      const formData = new FormData();
      formData.append("file", file);
      const url = "/api/upload";
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
          return `_file${get(result, "[0]")}`;
        }
      }
      throw new Error("Upload Failed");
    };

    if (event.target.files) {
      const list = [] as any[];
      input.fase = "upload";
      input.render();
      const files = event.target.files.length;
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target?.files?.item(i);
        if (file) {
          list.push({
            name: file.name,
            data: file,
          });
        }
      }

      fm.data[field.name] = list;
      fm.render();
      on_change(fm.data?.[field.name]);
      input.fase = "start";
      input.render();
    }

    if (input.ref) {
      input.ref.value = null;
    }
  };

  return (
    <div className="flex-grow flex-col flex w-full h-full items-stretch p-1">
      <div
        className={cx(
          "flex flex-row flex-wrap",
          css`
            flex-flow: row wrap;
          `
        )}
      >
        {input.fase === "upload" && (
          <div
            className={cx(
              "flex gap-x-2 p-2 flex-row items-center border rounded-md border-gray-500",
              css`
                height: 30px;
              `
            )}
          >
            <Spinner /> <div>Uploading</div>
          </div>
        )}
      </div>
      <div className="flex pt-1">
        <div
          className={cx(
            "button flex border rounded cursor-pointer hover:bg-blue-50",
            css`
              &:hover {
                border: 1px solid #1c4ed8;
                outline: 1px solid #1c4ed8;
              }
            `
          )}
        >
          <div
            className={cx(
              "flex flex-row relative flex-grow pr-2 items-center ",
              css`
                padding-top: 3px;
                padding-bottom: 2px;
                input[type="file"],
                input[type="file"]::-webkit-file-upload-button {
                  cursor: pointer;
                }
              `
            )}
          >
            <input
              ref={(ref) => {
                if (!input.ref) {
                  input.ref = ref;
                }
              }}
              type="file"
              multiple={true}
              accept={""}
              onChange={on_upload}
              className={cx(
                "absolute w-full h-full cursor-pointer top-0 left-0 opacity-0"
              )}
            />
            {input.fase === "start" && (
              <div
                className={cx(
                  "items-center flex text-base px-1 outline-none rounded cursor-pointer"
                )}
              >
                <div className="flex flex-row items-center px-2">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="flex flex-row items-center text-sm">
                  Upload File
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        ></div>
      </div>
    </div>
  );
};
