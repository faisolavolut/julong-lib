import { FC } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { ButtonBetter, ButtonContainer } from "@/lib/components/ui/button";
import { IoEye } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import api from "@/lib/utils/axios";
import { get_user } from "@/lib/utils/get_user";
import { toast } from "sonner";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import get from "lodash.get";
export const AlertCeoApprove: FC<any> = ({ fm }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-row flex-grow">
            <ButtonBetter>Approve</ButtonBetter>
          </div>
        </DialogTrigger>
        <DialogContent className=" flex flex-col">
          <DialogHeader>
            <DialogTitle>Approve</DialogTitle>
            <DialogDescription>
              Are You Sure to Approve This Batch?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <ButtonBetter variant={"outline"}>
                <div className="flex items-center gap-x-0.5">
                  <span className="capitalize">No</span>
                </div>
              </ButtonBetter>
            </DialogClose>
            <DialogClose asChild>
              <ButtonBetter
                onClick={async () => {
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
                      {"Saving..."}
                    </>
                  );
                  try {
                    const batch = await api.get(
                      `${process.env.NEXT_PUBLIC_API_MPP}/api/batch/find-by-status/NEED APPROVAL`
                    );
                    const id = batch?.data?.data?.id;
                    const param = {
                      id,
                      status: "APPROVED",
                      approved_by: get_user("employee.id"),
                      approver_name: get_user("employee.name"),
                    };

                    const res = await api.put(
                      `${process.env.NEXT_PUBLIC_API_MPP}/api/batch/update-status`,
                      param
                    );

                    fm.data = null;
                    fm.render();
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
                            Record Saved
                          </div>
                        </div>
                      );
                    }, 1000);
                  } catch (ex: any) {
                    toast.error(
                      <div className="flex flex-col w-full">
                        <div className="flex text-red-600 items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Submit Failed { get(ex, "response.data.meta.message") || ex.message}.
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
                }}
              >
                <div className="flex items-center gap-x-0.5">
                  <span className="capitalize">Yes</span>
                </div>
              </ButtonBetter>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
