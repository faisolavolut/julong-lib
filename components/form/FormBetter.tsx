"use client";
import { Form } from "./Form";
import { useEffect, useState } from "react";

export const FormBetter: React.FC<any> = ({
  children,
  header,
  onTitle,
  onLoad,
  onSubmit,
  onFooter,
  showResize,
  mode,
  className,
  onInit,
}) => {
  const [fm, setFM] = useState<any>({
    data: null as any,
  });
  useEffect(() => {}, [fm.data]);
  return (
    <div className="flex flex-col flex-grow gap-y-3">
      {typeof fm === "object" && typeof onTitle === "function" ? (
        <div className="flex flex-row p-3 items-center bg-white border border-gray-300 rounded-lg">
          {onTitle(fm)}
        </div>
      ) : (
        <></>
      )}
      <div className="w-full flex-grow flex flex-row  rounded-lg overflow-hidden">
        <div className="w-full flex flex-row flex-grow bg-white rounded-lg border border-gray-300  relative overflow-y-scroll">
          <Form
            {...{
              children,
              header,
              onTitle,
              onLoad,
              onSubmit,
              onFooter,
              showResize,
              mode,
              className: cx(className, "absolute top-0 left-0 w-full"),
              onInit: (form: any) => {
                setFM(form);

                const originalRender = form.render;

                // Buat versi baru dari `local.render`
                form.render = () => {
                  // Panggil fungsi asli
                  originalRender();

                  // Tambahkan logika tambahan untuk sinkronisasi
                  setFM({
                    ...form,
                    submit: form.submit,
                    render: form.render,
                    data: form.data,
                  });
                };
                form.render();
                if (typeof onInit === "function") {
                  onInit(form);
                }
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
