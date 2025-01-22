import { FC, useEffect } from "react";

export const InitEditor: FC<any> = ({ local, editor }) => {
  useEffect(() => {
    local.editor = editor;
    local.render();
  }, []);
  return <div></div>;
};
