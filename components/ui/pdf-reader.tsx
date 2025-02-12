"use client";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useEffect, useState } from "react";
interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [client, setClient] = useState(false);
  const defaultLayout = defaultLayoutPlugin();
  useEffect(() => {
    setClient(true);
  }, []);
  if (!client) return <></>;
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <Viewer
        theme="dark"
        fileUrl={url}
        plugins={[
          // Register plugins
          defaultLayout,
        ]}
      />
    </Worker>
  );
}
