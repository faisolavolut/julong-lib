export const init_column = (data: any[]): any[] => {
  return data.length
    ? data.map((e) => {
        return {
          accessorKey: e.name,
          ...e,
        };
      })
    : [];
};
