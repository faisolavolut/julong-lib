import { useLocal } from "@/lib/utils/use-local";
import { FC, ReactElement, useEffect, useTransition } from "react";
import { Popover } from "../Popover/Popover";
import { TypeColor } from "../form/field/TypeColor";

export const FieldColorPicker: FC<{
  children: ReactElement;
  value?: string;
  update: (value: string) => void;
  open: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  showHistory?: boolean;
}> = ({ children, value, update, open, onClose, onOpen, showHistory }) => {
  const local = useLocal({ show: open || false });
  useEffect(() => {
    if (value) {
      local.show = open || false;
      local.render();
    }
  }, [value, open]);
  const [_, tx] = useTransition();

  return (
    <Popover
      open={local.show}
      onOpenChange={(open: any) => {
        local.show = open;
        if (open && onOpen) {
          onOpen();
        } else if (onClose) {
          onClose();
        }
        local.render();
      }}
      backdrop={false}
      popoverClassName="rounded-md p-2 text-sm bg-white shadow-2xl border border-slate-300"
      content={
        <TypeColor
          value={value}
          showHistory={showHistory}
          onClose={() => {
            local.show = false;
            local.render();
            if (onClose) onClose();
          }}
          onChangePicker={(color: any) => {
            tx(() => {
              if (color.indexOf("NaN") < 0) {
                update(color);
              }
            });
          }}
        />
      }
    >
      <div
        onClick={() => {
          local.show = true;
          local.render();
          if (onOpen) onOpen();
        }}
      >
        {children}
      </div>
    </Popover>
  );
};
