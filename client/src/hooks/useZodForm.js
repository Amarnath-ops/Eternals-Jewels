import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const useZodForm = (schema, options = {})=>{
  return useForm({
    resolver:zodResolver(schema),
    mode:"onTouched",
    ...options
  })
}

export default useZodForm;