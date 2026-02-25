import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOffer, updateOffer, deleteOffer, toggleOfferStatus } from "@/api/admin/offer.api";
import toast from "react-hot-toast";

export const useCreateOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOffer,
        onSuccess: (res) => {
            queryClient.invalidateQueries(["offers"]);
            toast.success(res.message || "Offer created successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create offer");
        },
    });
};

export const useUpdateOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateOffer(id, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries(["offers"]);
            toast.success(res.message || "Offer updated successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update offer");
        },
    });
};

export const useDeleteOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOffer,
        onSuccess: (res) => {
            queryClient.invalidateQueries(["offers"]);
            toast.success(res.message || "Offer deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete offer");
        },
    });
};

export const useToggleOfferStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleOfferStatus,
        onSuccess: (res) => {
            queryClient.invalidateQueries(["offers"]);
            toast.success(res.message || "Offer status updated");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to toggle status");
        },
    });
};
