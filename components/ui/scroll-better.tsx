import React from "react";

export default function CustomScroll({ children, className }: any) {
  return (
    <div className={`relative ${className}`}>
      {/* Kontainer Scroll */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <div className="scroll-area w-full h-full overflow-y-auto">
          {/* Konten Scroll */}
          {children}
        </div>
      </div>

      {/* Scrollbar Manual */}
      <div className="scrollbar-track absolute top-0 right-0 w-2 h-full bg-gray-200 rounded-lg">
        <div className="scrollbar-thumb w-2 bg-gray-500 rounded-lg transition-transform duration-200 hover:bg-gray-600"></div>
      </div>
    </div>
  );
}
