import { Upload } from "lucide-react";
import { ChangeEvent, FC } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Spinner } from "../../ui/spinner";
import { FilePreviewBetter } from "./FilePreview";
import { MdDelete } from "react-icons/md";

export const FieldUploadMulti: FC<{
  field: any;
  fm: any;
  on_change: (e: any) => void | Promise<void>;
  mode?: "upload";
  valueKey?: string;
  onDelete?: (e: any) => any | Promise<any>;
}> = ({ field, fm, on_change, mode, valueKey = "url", onDelete }) => {
  const styling = "mini";
  const disabled = field?.disabled || false;
  let value: any = fm.data?.[field.name];
  // let type_upload =
  const input = useLocal({
    value: [] as any[],
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
            [valueKey]: `${URL.createObjectURL(file)}`,
          });
        }
      }
      fm.data[field.name] = list;
      fm.render();
      if (typeof on_change === "function") on_change(fm.data?.[field.name]);
      input.fase = "start";
      input.render();
    }

    if (input.ref) {
      input.ref.value = null;
    }
  };
  return (
    <div className="flex-grow flex-col flex w-full h-full items-stretch relative">
      {!disabled ? (
        <>
          {" "}
          <div className="flex flex-wrap py-1 pb-2">
            <div className=" relative flex focus-within:border focus-within:border-primary border border-gray-300 rounded-md ">
              <div
                className={cx(
                  "hover:bg-gray-50 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 ",
                  css`
                    input[type="file"],
                    input[type="file"]::-webkit-file-upload-button {
                      cursor: pointer;
                    }
                  `,
                  disabled && "bg-gray-50"
                )}
              >
                {!disabled && (
                  <input
                    ref={(ref) => {
                      if (ref) input.ref = ref;
                    }}
                    type="file"
                    multiple={true}
                    // accept={field.prop.upload?.accept}
                    accept={"file/**"}
                    onChange={on_upload}
                    className={cx(
                      "absolute w-full h-full cursor-pointer top-0 left-0 opacity-0"
                    )}
                  />
                )}
                {!disabled ? (
                  <div
                    onClick={() => {
                      if (input.ref) {
                        input.ref.click();
                      }
                    }}
                    className="items-center flex text-base px-1 outline-none rounded cursor-pointer flex-row justify-center"
                  >
                    <div className="flex flex-row items-center px-2">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div className="flex flex-row items-center  text-sm">
                      Add File
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row items-center px-1.5 text-sm">
                    -
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="flex flex-wrap gap-2">
        {Array.isArray(value) && value?.length ? (
          <>
            {value.map((e: any, idx: number) => {
              return (
                <div className="flex flex-col" key={`files-${name}-${idx}`}>
                  <div className="flex flex-row items-center w-64 p-2 border rounded-lg shadow-sm bg-white">
                    <div className="flex flex-grow flex-row items-center">
                      <div className="flex flex-grow">
                        <FilePreviewBetter
                          url={e?.[valueKey]}
                          filename={e?.name}
                          disabled={disabled}
                        />
                      </div>
                      <div
                        className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                        onClick={() => {
                          fm.data[field.name] = value.filter(
                            (_, i) => i !== idx
                          );
                          fm.render();
                          if (typeof on_change === "function")
                            on_change(fm.data?.[field.name]);

                          if (typeof onDelete === "function") onDelete(e);
                        }}
                      >
                        <MdDelete className="w-4 h-4 text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
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
