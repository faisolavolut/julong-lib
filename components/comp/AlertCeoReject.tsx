import { FC, useEffect } from "react";
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
import { Checkbox } from "@/lib/components/ui/checkbox";
import { IoEye } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import { useLocal } from "@/lib/utils/use-local";
import api from "@/lib/utils/axios";
import { Form } from "../form/Form";
import { Field } from "../form/Field";
import { cloneFM } from "@/lib/utils/cloneFm";
import { toast } from "sonner";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { get_user } from "@/lib/utils/get_user";
import { events } from "@/lib/utils/event";
import get from "lodash.get";
export const AlertCeoReject: FC<any> = ({ lc }) => {
  const local = useLocal({
    organization: [] as any[],
    reject: "reject-all" as any,
    fm: null as any,
    org: [] as string[] 
  });
  useEffect(() => {
    const run = async () => {
      const batch: any = await api.get(
        `${process.env.NEXT_PUBLIC_API_MPP}/api/batch/find-by-status/NEED APPROVAL`
      );
      const btc = batch?.data?.data;
      const addtional = {
        status: "APPROVED",
        paging: 1,
        take: 500,
      };
      const params = await events("onload-param", addtional);
      const res: any = await api.get(
        `${process.env.NEXT_PUBLIC_API_MPP}/api/batch/organizations/${btc?.id}` +
          params
      );
      const data: any[] = res.data.data;
      const result = data?.length
        ? data.map((e) => {
            return { id: e.id, label: e.name };
          })
        : [];
      local.organization = result;
      local.render();
    };
    run();
  }, []);
  const items = [
    {
      id: "reject-all",
      label: "Reject All",
    },
    {
      id: "reject-partially",
      label: "Reject Partially",
    },
  ] as const;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-row flex-grow">
            <ButtonBetter variant={"reject"}>Reject</ButtonBetter>
          </div>
        </DialogTrigger>
        <DialogContent className=" flex flex-col">
          <DialogHeader>
            <DialogTitle>Reject</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col gap-y-2 mb-2">
              {items.map((item) => (
                <div
                  className="flex items-center space-x-2"
                  key={"checkbox_item_reject" + item.id}
                >
                  <Checkbox
                    id={item.id}
                    checked={local?.reject === item.id}
                    onCheckedChange={(e) => {
                      local.reject = item.id;
                      local.render();
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>

            {local?.reject === "reject-partially" &&
              local?.organization?.length && (
                <>
                  <Form
                    onSubmit={async (fm: any) => {}}
                    onLoad={async () => {
                      return {
                        organization: [],
                      };
                    }}
                    showResize={false}
                    header={(fm: any) => {
                      return <></>;
                    }}
                    onInit={(fm: any) => {
                      local.fm = fm;
                      local.render();
                    }}
                    children={(fm: any) => {
                      return (
                        <div className="flex flex-col gap-y-2 flex-grow pl-6 max-h-[250px] overflow-y-scroll">
                          {local.organization.map((item) => {
                            const is_check = fm.data?.organization?.length
                              ? fm.data.organization.find(
                                  (org: any) => org?.id === item.id
                                )
                              : false;
                            const data = fm.data?.organization?.length
                              ? fm.data.organization.find(
                                  (org: any) => org?.id === item.id
                                )
                              : {};
                            return (
                              <div
                                className="flex flex-col"
                                key={"checkbox_item_reject" + item.id}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={item.id}
                                    onCheckedChange={(e) => {
                                      if (e) {
                                        if (
                                          !Array.isArray(fm.data?.organization)
                                        ) {
                                          fm.data["organization"] = [];
                                          fm.render();
                                        }
                                        // Jika checkbox dicentang, tambahkan item ke array organization
                                        fm.data.organization.push({
                                          id: item.id,
                                        });
                                      } else {
                                        // Jika checkbox tidak dicentang, hapus item dari array organization
                                        fm.data["organization"] = fm.data
                                          ?.organization?.length
                                          ? fm.data.organization.filter(
                                              (org: any) => org?.id !== item.id
                                            )
                                          : [];
                                      }
                                      fm.render();
                                      local.org = fm.data?.organization?.length ? fm.data.organization.map((e: any) => {
                                        return {
                                          id:  e.id
                                        }
                                      }) : [];
                                      local.render();
                                    }}
                                  />
                                  <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {item.label}
                                  </label>
                                </div>
                                {is_check ? (
                                  <div className="pt-1 pb-3">
                                    <Field
                                      fm={cloneFM(fm, data)}
                                      hidden_label={true}
                                      name={"notes"}
                                      label={"Organization"}
                                      type={"text"}
                                      placeholder="Notes"
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
                </>
              )}
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <ButtonBetter variant={"outline"}>
                <div className="flex items-center gap-x-0.5">
                  <span className="capitalize">No</span>
                </div>
              </ButtonBetter>
            </DialogClose>
            <DialogClose
              asChild
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
                  const isPartial = local.reject === "reject-partially";
                  if (isPartial) {
                    const partial = local?.org || [];
                    const res = await api.put(
                      `${process.env.NEXT_PUBLIC_API_MPP}/api/mp-plannings/lines/reject-partial-pt`,
                      { approver_id: get_user("employee.id"), payload: partial }
                    );
                  } else {
                    const batch = await api.get(
                      `${process.env.NEXT_PUBLIC_API_MPP}/api/batch/find-by-status/NEED APPROVAL`
                    );
                    const id = batch?.data?.data?.id;
                    const param = {
                      id,
                      status: "REJECTED",
                      approved_by: get_user("employee.id"),
                      approver_name: get_user("employee.name"),
                    };

                    const res = await api.put(
                      `${process.env.NEXT_PUBLIC_API_MPP}/api/batch/update-status`,
                      param
                    );
                  }
                  lc.data = null;
                  lc.render()

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
              <ButtonBetter>
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
