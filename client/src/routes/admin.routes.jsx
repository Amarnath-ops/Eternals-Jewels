import axiosInstance from "@/api/axios";
import AdminLayout from "@/layouts/AdminDashboard";
import AddCategory from "@/pages/admin/AddCategory";
import CategoryPage from "@/pages/admin/CategoryPage";
import CustomerList from "@/pages/admin/CustomerList";
import Dashboard from "@/pages/admin/Dashboard";
import AdminLogin from "@/pages/admin/Login";
import UpdateCategory from "@/pages/admin/UpdateCategory";
import ProductList from "@/pages/admin/ProductList";
import OrderList from "@/pages/admin/OrderList";
import { setAdminCredentials } from "@/store/admin/adminAuthSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AddProduct from "@/pages/admin/AddProduct";

import EditProduct from "@/pages/admin/EditProduct";
import OrderDetails from "@/pages/admin/OrderDetails";
const AdminRoutes = () => {
    const dispatch = useDispatch();
    const restoreToken = async () => {
        try {
            const res = await axiosInstance.post("/admin/auth/refresh");
            dispatch(setAdminCredentials({ accessToken: res.data.data.accessToken, user: res.data.data.user }));
        } catch (error) {
            console.error("No active Sessions ", error);
        }
    };
    useEffect(() => {
        restoreToken();
    }, []);

    const accessToken = useSelector((state) => state.admin?.accessToken);
    console.log(accessToken)
    return (
        <>
            <Routes>
                <Route path="login" element={accessToken ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
                <Route  path=""  element={accessToken ? <AdminLayout /> : <AdminLogin />}>
                    <Route index path="dashboard" element={<Dashboard />} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="categories" element={<CategoryPage/> }/>
                    <Route path="categories/add-categories" element={<AddCategory/>}/>
                    <Route path="categories/edit-category/:categoryId" element={<UpdateCategory/>}/>
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/add-product" element={<AddProduct />} />
                    <Route path="products/edit-product/:id" element={<EditProduct />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="orders/:orderId" element={<OrderDetails />} />
                </Route>
            </Routes>
        </>
    );
};

export default AdminRoutes;
