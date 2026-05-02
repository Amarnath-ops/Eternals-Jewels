import axiosInstance from "../axios";

export const getOffers = async (params) => {
    const response = await axiosInstance.get("/admin/offers", { params });
    return response.data;
};

export const createOffer = async (offerData) => {
    const response = await axiosInstance.post("/admin/offers", offerData);
    return response.data;
};

export const getOfferById = async (id) => {
    const response = await axiosInstance.get(`/admin/offers/${id}`);
    return response.data;
};

export const updateOffer = async (id, offerData) => {
    const response = await axiosInstance.patch(`/admin/offers/${id}`, offerData);
    return response.data;
};

export const deleteOffer = async (id) => {
    const response = await axiosInstance.delete(`/admin/offers/${id}`);
    return response.data;
};

export const toggleOfferStatus = async (id) => {
    const response = await axiosInstance.patch(`/admin/offers/${id}/toggle`);
    return response.data;
};

export const getActiveOffersByType = async (type) => {
    const response = await axiosInstance.get(`/admin/offers/active`, { params: { type } });
    return response.data;
};
