import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const useZodForm = (schema)=>{
  return useForm({
    resolver:zodResolver(schema),
    mode:"onTouched"
  })
}

export default useZodForm;