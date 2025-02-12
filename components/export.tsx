import dynamic from "next/dynamic";

export const PDFViewer = dynamic(
  () => import("@/lib/components/ui/pdf-reader"),
  { ssr: false }
);
