import { useLocal } from "@/lib/utils/use-local";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
export const PinterestLayout: React.FC<{
  data: any[];
  child: (item: any, index: any, data: any[], key?: string) => any;
  col: number;
  gap?: number;
}> = ({ data, child, col = 2, gap = 2 }) => {
  function generateUUIDs(data: any[]): string[] {
    return data.map(() => uuidv4());
  }
  const createColumns = (items: any[], numCols: number) => {
    const columns: any = Array.from({ length: numCols }, () => []); // Membuat array kosong sebanyak jumlah kolom
    items.forEach((item, index) => {
      columns[index % numCols].push(item); // Memasukkan item ke dalam kolom secara berurutan
    });
    return columns;
  };
  const local = useLocal({
    data: [] as any[],
    ids: {
      col: [] as string[],
      data: [] as string[],
    },
    user: null as any,
    ready: false as boolean,
  });
  useEffect(() => {
    const columns: any[] = Array.from({ length: col }, () => []);
    data.forEach((item, index) => {
      const targetColumn = index % col; // Menentukan kolom target berdasarkan indeks
      columns[targetColumn].push(item); // Memasukkan elemen ke kolom yang sesuai
    });
    local.data = columns;
    local.render();
  }, [data, col]);
  return (
    <>
      <div className="flex flex-grow flex-1 flex-col w-full h-full">
        <div
          className={cx(
            `grid gap-${gap}`,
            css`
              grid-template-columns: repeat(${col}, minmax(0, 1fr));
            `
          )}
        >
          {local.data.map((el, idx) => {
            return (
              <div className={`flex flex-col gap-${gap}`} key={"col_" + idx}>
                {Array.isArray(el) && el.length ? (
                  <div
                    key={"col_" + idx + "_idx_" + idx}
                    className={`flex flex-col gap-${gap}`}
                  >
                    {el.map((item, ids, data) => {
                      return (
                        <div key={"row_" + idx + "_" + ids}>
                          {child(item, idx, data, "item_" + idx + "_" + ids)}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
