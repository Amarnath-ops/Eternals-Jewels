import { QUERY_KEYS } from "@/lib/queryKeys";
import { addressServices } from "@/services/address.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addressServices.updateAddress,
        onSuccess: (updatedAdddress) => {
            console.log(updatedAdddress);
            queryClient.setQueryData(QUERY_KEYS.ADDRESS_KEY, (oldAddresses) => {
                return oldAddresses.map((addr) => {
                    if (addr._id === updatedAdddress._id) {
                        return updatedAdddress;
                    }
                    if (updatedAdddress.isDefault) {
                        return { ...addr, isDefault: false };
                    }
                    return addr;
                }).sort((a,b)=>b.isDefault - a.isDefault);
            });
            toast.success("Address updated successfully.");
        },
    });
};
