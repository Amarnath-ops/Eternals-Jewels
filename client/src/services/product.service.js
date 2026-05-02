import {
    addProductApi,
    deleteProductApi,
    getProductByIdApi,
    getProductsApi,
    toggleProductApi,
    updateProductApi,
} from "../api/admin/products.api";

export const productService = {
    addProduct: async (data) => {
        return await addProductApi(data);
    },
    getProducts: async (params) => {
        return await getProductsApi(params);
    },
    getProductById: async (id) => {
        return await getProductByIdApi(id);
    },
    updateProduct: async ({ id, data }) => {
        return await updateProductApi({ id, data });
    },
    deleteProduct: async (id) => {
        return await deleteProductApi(id);
    },
    toggleProduct: async (id) => {
        return await toggleProductApi(id);
    },
};
