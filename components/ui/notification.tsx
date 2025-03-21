import { FC, useState } from "react";
import { SheetBetter } from "./sheet";
import { NotificationUnread } from "@/lib/svg/NotificationUnread";
import { X } from "lucide-react";
import { ListUI } from "../list/ListUI";
import { events } from "@/lib/utils/event";
import { apix } from "@/lib/utils/apix";
import { getNumber } from "@/lib/utils/getNumber";

export const NotificationSheet: FC<{ children?: any; className?: string }> = ({
  children,
  className,
}) => {
  const [isNotification, setNotification] = useState(false);
  return (
    <SheetBetter
      open={isNotification}
      contentOpen={
        <div className={className}>
          {children ? children : <NotificationUnread className="h-6 w-6" />}
        </div>
      }
      side="right"
      onOpenChange={(event) => {
        setNotification(event);
      }}
      showClose={false}
      className="p-0"
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row py-4 items-center  px-2 border-b border-gray-300">
          <div className="flex flex-grow">
            <p className="font-bold text-lg">Notification</p>
          </div>

          <div
            onClick={() => {
              setNotification(false);
            }}
          >
            <X className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <ListUI
            className={"border-none"}
            name="todo"
            content={({ item }: any) => {
              return (
                <>
                  <div className="border border-gray-200  bg-white p-2 rounded-lg shadow-lg max-w-md">
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-x-2 text-xs items-center">
                        <div className=" p-1 rounded-md font-bold text-gray-800 bg-red-500">
                          ANNOUNCEMENT
                        </div>
                        <div className="text-gray-600 ">March 17, 2025</div>
                      </div>
                      <p className="text-xs py-2">
                        Join our online event and learn how to make money online
                      </p>
                    </div>
                  </div>
                </>
              );
            }}
            onLoad={async (param: any) => {
              const params = await events("onload-param", {
                ...param,
              });
              const result: any = await apix({
                port: "recruitment",
                value: "data.data.job_postings",
                path: `/api/job-postings${params}`,
                validate: "array",
              });
              return result;
            }}
            onCount={async () => {
              const result: any = await apix({
                port: "recruitment",
                value: "data.data.total",
                path: `/api/job-postings?page=1&page_size=1`,
                validate: "object",
              });
              return getNumber(result);
            }}
          />
        </div>
      </div>
    </SheetBetter>
  );
};
