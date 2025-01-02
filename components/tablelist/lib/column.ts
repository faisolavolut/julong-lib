export const init_column = (data: any[]) => {
  return data.length
    ? data.map((e) => {
        return {
          accessorKey: e.name,
          ...e,
        };
      })
    : [];
};
