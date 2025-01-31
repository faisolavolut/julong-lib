import get from "lodash.get";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const actionToast = async (data: {
  task: () => Promise<any>;
  before?: () => any;
  success?: () => any;
  after?: () => any;
  msg_succes?: string;
  msg_error?: string;
  msg_load?: string;
}) => {
  const { task, before, after, success, msg_succes, msg_error, msg_load } =
    data;

  try {
    if (typeof before === "function") before();
    toast.info(
      <>
        <Loader2
          className={cx(
            "h-4 w-4 animate-spin-important",
            css`
              animation: spin 1s linear infinite !important;
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `
          )}
        />
        {msg_load ? msg_load : " Load..."}
      </>
    );
    if (typeof task === "function") await task();
    setTimeout(() => {
      toast.success(
        <div
          className={cx(
            "cursor-pointer flex flex-col select-none items-stretch flex-1 w-full"
          )}
          onClick={() => {
            toast.dismiss();
          }}
        >
          <div className="flex text-green-700 items-center success-title font-semibold">
            <Check className="h-6 w-6 mr-1 " />
            {msg_succes ? msg_succes : "Success"}
          </div>
        </div>
      );

      if (typeof after === "function") after();
      if (typeof success === "function") success();
    }, 1000);
  } catch (ex: any) {
    toast.error(
      <div className="flex flex-col w-full">
        <div className="flex text-red-600 items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {msg_error ? msg_error : "Failed"}{" "}
          {get(ex, "response.data.meta.message") || ex.message}.
        </div>
      </div>,
      {
        dismissible: true,
        className: css`
          background: #ffecec;
          border: 2px solid red;
        `,
      }
    );
  }
};
