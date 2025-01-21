import { useLocal } from "./use-local";

export const cloneFM = (fm: any, row: any) => {
  return {
    ...fm,
    data: row,
    render: fm.render,
  };
};
