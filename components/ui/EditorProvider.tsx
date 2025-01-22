import React, { createContext, FC, useContext } from "react";

const EditorContext = createContext(null);

export const EditorProvider: FC<any> = ({ editor, children }) => {
  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
};

export const useCurrentEditor = () => {
  return useContext(EditorContext);
};
