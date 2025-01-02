import { FieldUploadMulti } from "./TypeUploadMulti";
import { FieldUploadSingle } from "./TypeUploadSingle";

export const TypeUpload: React.FC<any> = ({name, fm, on_change, mode, type}) => {
  if(type === "multi"){
    
  return (
    <>
      <FieldUploadMulti
        field={{
          name
        }}
        fm={fm}
        on_change={on_change}
        mode={mode}
      />
    </>
  );
  }
  return (
    <>
      <FieldUploadSingle
        field={{
          name
        }}
        fm={fm}
        on_change={on_change}
        mode={mode}
      />
    </>
  );
};
