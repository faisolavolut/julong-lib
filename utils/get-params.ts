import { useParams } from "next/navigation";

export const getParams = (name: string) => {
  const params = useParams(); 
  return params?.[name]
}