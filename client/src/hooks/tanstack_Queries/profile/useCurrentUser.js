import { fectchCurrentUser } from "@/api/user.api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = ()=>{
  return useQuery({
        queryKey: QUERY_KEYS.CURRENT_USER,
        queryFn: fectchCurrentUser,
    });
}