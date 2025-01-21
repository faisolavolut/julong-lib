import { siteurl } from "@/lib/utils/siteurl";
import { useLocal } from "@/lib/utils/use-local";
import { ExternalLink } from "lucide-react";
import { ReactElement } from "react";

export const ThumbPreview = ({
  url,
  options,
}: {
  url: string;
  options: ReactElement;
}) => {
  const local = useLocal({ size: "", is_doc: true }, async () => {});

  const file = getFileName(url);
  if (typeof file === "string") return;

  const color = darkenColor(generateRandomColor(file.extension));
  let content = (
    <div
      className={cx(
        css`
          background: white;
          color: ${color};
          border: 1px solid ${color};
          color: ${color};
          border-radius: 3px;
          text-transform: uppercase;
          font-size: 14px;
          font-weight: black;
          padding: 3px 7px;

          width: 60px;
          height: 60px;

          &:hover {
            border: 1px solid #1c4ed8;
            outline: 1px solid #1c4ed8;
          }
        `,
        "flex justify-center items-center flex-col"
      )}
      onClick={() => {
        // let _url = siteurl(url || "");
        // window.open(_url, "_blank");
      }}
    >
      <div>{file.extension}</div>
      <div
        className={css`
          font-size: 9px;
          color: gray;
          margin-top: -3px;
        `}
      >
        {local.size}
      </div>
    </div>
  );

  let is_image = false;

  if ([".png", ".jpeg", ".jpg", ".webp"].find((e) => url.endsWith(e))) {
    is_image = true;
    local.is_doc = false;
    content = (
      <div className="rounded-lg w-96 overflow-hidden shadow-lg">
        <img
          onClick={() => {
            let _url = siteurl(url || "");
            window.open(_url, "_blank");
          }}
          className={cx(
            "rounded-md w-96 h-full object-cover",
            css`
              &:hover {
                outline: 2px solid #1c4ed8;
              }
            `,
            css`
              width: 60px;
              height: 60px;
              background-image: linear-gradient(
                  45deg,
                  #ccc 25%,
                  transparent 25%
                ),
                linear-gradient(135deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(135deg, transparent 75%, #ccc 75%);
              background-size: 25px 25px; /* Must be a square */
              background-position: 0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px; /* Must be half of one side of the square */
            `
          )}
          src={siteurl(
            `/_img/${url.substring("_file/".length)}?${"w=60&h=60&fit=cover"}`
          )}
        />
      </div>
    );
  }

  return (
    <>
      {file.extension && (
        <div
          className={cx(
            "flex border rounded items-start px-1 relative bg-white cursor-pointer",
            "space-x-1 py-1 thumb-preview"
          )}
        >
          {content}
          {options}
        </div>
      )}
    </>
  );
};

export const FilePreview = ({ url }: { url: string }) => {
  const file = getFileName(url);
  if (typeof file === "string")
    return (
      <div
        className={cx(
          css`
            border-radius: 3px;
            padding: 0px 5px;
            height: 20px;
            margin-right: 5px;
            height: 20px;
            border: 1px solid #ccc;
            background: white;
          `,
          "flex items-center text-md"
        )}
      >
        {file}
      </div>
    );
  const color = darkenColor(generateRandomColor(file.extension));
  let content = (
    <div
      className={cx(
        css`
          background: white;
          border: 1px solid ${color};
          color: ${color};
          border-radius: 3px;
          text-transform: uppercase;
          padding: 0px 5px;
          font-size: 9px;
          height: 15px;
          margin-right: 5px;
        `,
        "flex items-center"
      )}
    >
      {file.extension}
    </div>
  );
  const getFileNameWithoutExtension = (filename: string) => {
    const parts = filename.split(".");
    parts.pop(); // Hapus bagian terakhir (ekstensi)
    return parts.join("."); // Gabungkan kembali
  };
  const ura = url.startsWith("blob:") ? getFileNameWithoutExtension(url) : url;
  if ([".png", ".jpeg", ".jpg", ".webp"].find((e) => url.endsWith(e))) {
    content = (
      <div className="rounded-lg flex-grow overflow-hidden">
        <img
          onClick={() => {
            let _url = siteurl(url || "");
            window.open(_url, "_blank");
          }}
          className={cx(
            "rounded-md h-full object-cover",
            css`
              &:hover {
                outline: 2px solid #1c4ed8;
              }
            `,
            css`
              width: 30px;
              height: 30px;
              background-image: linear-gradient(
                  45deg,
                  #ccc 25%,
                  transparent 25%
                ),
                linear-gradient(135deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(135deg, transparent 75%, #ccc 75%);
              background-size: 25px 25px; /* Must be a square */
              background-position: 0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px; /* Must be half of one side of the square */
            `
          )}
          src={url.startsWith("blob:") ? ura : url}
        />
      </div>
    );
  }

  return (
    <>
      {file.extension && (
        <div
          className={cx(
            "flex border rounded items-center px-1  bg-white cursor-pointer flex-grow",
            "pr-2",
            css`
              &:hover {
                border: 1px solid #1c4ed8;
                outline: 1px solid #1c4ed8;
              }
            `
          )}
          onClick={() => {
            let _url: any = url.startsWith("blob:") ? ura : siteurl(ura || "");
            console.log(_url);
            window.open(_url, "_blank");
          }}
        >
          {content}
          <div className="ml-2">
            <ExternalLink size="12px" />
          </div>
        </div>
      )}
    </>
  );
};
function darkenColor(color: string, factor: number = 0.5): string {
  const rgb = hexToRgb(color);
  const r = Math.floor(rgb.r * factor);
  const g = Math.floor(rgb.g * factor);
  const b = Math.floor(rgb.b * factor);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
function generateRandomColor(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(); // Return a string representation of the hash
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}
const getFileName = (url: string) => {
  if (url.startsWith("[")) {
    try {
      const list = JSON.parse(url);
      if (list.length === 0) return "Empty";
      return `${list.length} File${list.length > 1 ? "s" : ""}`;
    } catch (e) {
      console.error(`Error parsing multi-file: ${url}`);
    }
    return "Unknown File";
  }

  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const dotIndex = fileName.lastIndexOf(".");
  const fullname = fileName;
  if (dotIndex === -1) {
    return { name: fileName, extension: "", fullname };
  }
  const name = fileName.substring(0, dotIndex);
  const extension = fileName.substring(dotIndex + 1);
  return { name, extension, fullname };
};

export const ImgThumb = ({
  className,
  url,
  w,
  h,
  fit,
}: {
  className?: string;
  url: string;
  w: number;
  h: number;
  fit?: "cover" | "contain" | "inside" | "fill" | "outside";
}) => {
  const local = useLocal({ error: false });
  return (
    <div
      className={cx(
        "img-thumb",
        className,
        css`
          width: ${w}px;
          height: ${h}px;
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(135deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(135deg, transparent 75%, #ccc 75%);
          background-size: 25px 25px; /* Must be a square */
          background-position: 0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px; /* Must be half of one side of the square */
        `
      )}
    >
      {!local.error && url && (
        <img
          onError={() => {
            local.error = true;
            local.render();
          }}
          src={siteurl(
            `/_img/${url.substring("_file/".length)}?w=${w}&h=${h}&fit=${
              fit || "cover"
            }`
          )}
        />
      )}
    </div>
  );
};
