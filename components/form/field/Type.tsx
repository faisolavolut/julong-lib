import { TextInput } from "flowbite-react";

export const TypeInput: React.FC<any> = () => {
  return (
    <>
      <TextInput
        id="name"
        name="name"
        placeholder="Type product name"
        required
      />
    </>
  );
};
