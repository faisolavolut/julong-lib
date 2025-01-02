import { FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import Link from "next/link";

const BreadcrumbBetter: FC<any> = ({ data }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
const BreadcrumbBetterLink: FC<{ data: any[]; className?: string }> = ({
  data,
  className,
}) => {
  const item: any[] = addSeparator(data, ".");
  return (
    <Breadcrumb>
      <BreadcrumbList className={cx(className)} >
        {item.map((e, idx) => {
          if (typeof e === "string" && e === ".")
            return <BreadcrumbSeparator key={"separator_"+idx}/>;
          return (
            <BreadcrumbItem key={"item_"+idx}>
              {e?.url ? (
                <BreadcrumbLink asChild>
                  <Link href={e.url} className="hover:underline">{e.title}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{e.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
const addSeparator = (arr: any[], separator: any | string) => {
  if (arr.length === 0) return [];

  // Menggunakan flatMap untuk menyisipkan separator di antara elemen
  return arr.flatMap((item, index) =>
    index < arr.length - 1 ? [item, separator] : [item]
  );
};

export { BreadcrumbBetter, BreadcrumbBetterLink };
