import React, { useState } from "react";
import { Eye, Edit, Trash2, Search, ChevronRight } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { SpinnerBadge } from "@/components/Spinner";
import ConfirmModal from "@/components/Modal";
import { useGetProducts } from "@/hooks/tanstack_Queries/admin/products/useGetProducts";
import { useDeleteProduct } from "@/hooks/tanstack_Queries/admin/products/useDeleteProduct";
import { useToggleProduct } from "@/hooks/tanstack_Queries/admin/products/useToggleProduct";
import { useGetCategories } from "@/hooks/tanstack_Queries/admin/categories/useGetCategories";
import ProductDetailsModal from "@/components/admin/products/ProductDetailsModal";

const ProductList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [productId, setProductId] = useState(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);

    const [sort, setSort] = useState("createdAt");
    const [selectedCategory, setSelectedCategory] = useState("");
    const limit = 5;
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data: productsData, isLoading } = useGetProducts({
        page: currentPage,
        limit,
        search: debouncedSearch,
        sort: sort === "priceHigh" ? "-variants.0.salePrice" : sort === "priceLow" ? "variants.0.salePrice" : "-createdAt",
        category: selectedCategory,
    });

    const { data: categoriesData } = useGetCategories({
        page: 1,
        limit: 100,
        sort: "categoryName",
    });

    const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
    const { mutateAsync: toggleProduct, isPending: isToggling } = useToggleProduct();

    const totalProducts = productsData?.total || 0;
    const totalPages = productsData?.totalPages || 1;
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalProducts);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };



    const onDeleteClick = (product) => {
        setProductId(product._id);
        setOpenConfirmModal(true);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setOpenDetailsModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteProduct(productId);
        } catch (error) {
            console.error(error);
        } finally {
            setOpenConfirmModal(false);
            setProductId(null);
        }
    };

    const handleToggleList = async (product) => {
        try {
            await toggleProduct(product._id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="flex-1 bg-white min-h-screen p-8 font-sans">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1 border-b-2 border-gray-800 inline-block pb-1">
                            Products
                        </h1>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <Link to="/admin/dashboard" className="hover:text-gray-800">
                                Dashboard
                            </Link>
                            <ChevronRight size={16} className="mx-1" />
                            <span className="text-gray-900 font-medium">Products</span>
                        </div>
                    </div>

                    <Link
                        to="add-product"
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
                    >
                        Add New Product
                        <span className="text-xl font-bold">+</span>
                    </Link>
                </div>

                <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center w-full xl:w-auto text-sm">
                        <span className="font-bold text-gray-900 whitespace-nowrap border border-gray-300 border-r-0 px-4 py-2.5 rounded-l-lg bg-gray-50">
                            Filter By
                        </span>

                        <div className="relative">
                            <select
                                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-r-lg focus:outline-none focus:bg-white focus:border-gray-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categoriesData?.categories?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full xl:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black sm:text-sm transition duration-150 ease-in-out shadow-sm"
                            placeholder="Search product..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white text-sm font-medium shadow-sm">
                        <span className="px-4 py-2.5 bg-gray-50 text-gray-900 border-r border-gray-300 font-bold">
                            Sort
                        </span>
                        <button
                            className={`py-2.5 px-4 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition border-r border-gray-300 ${sort === "priceHigh" && "bg-gray-100 text-green-700 font-bold"}`}
                            onClick={() => setSort("priceHigh")}
                        >
                            Price High - Low
                        </button>
                        <button
                            className={`py-2.5 px-4 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition border-r border-gray-300 ${sort === "priceLow" && "bg-gray-100 text-green-700 font-bold"}`}
                            onClick={() => setSort("priceLow")}
                        >
                            Price Low - High
                        </button>
                        <button
                            className={`py-2.5 px-4 text-gray-600 hover:text-green-700 hover:bg-gray-50 transition ${sort === "createdAt" && "bg-gray-100 text-green-700 font-bold"}`}
                            onClick={() => setSort("createdAt")}
                        >
                            Last added first
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-t-lg shadow-sm">
                    <table className="w-full min-w-max border-collapse">
                        <thead>
                            <tr className="bg-[#1a5f32] text-white text-sm font-medium text-left">
                                <th className="p-4 py-5 rounded-tl-lg">Image</th>
                                <th className="p-4 py-5">Product Name</th>
                                <th className="p-4 py-5">Category</th>
                                <th className="p-4 py-5 text-center">Product Details</th>
                                <th className="p-4 py-5 text-center">List</th>
                                <th className="p-4 py-5 rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-700 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 border border-gray-200">
                                        <div className="flex justify-center items-center">
                                            <SpinnerBadge content={"Loading..."} />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {productsData?.products?.length > 0 ? (
                                        productsData.products.map((item) => {
                                            return (
                                                <tr
                                                    key={item._id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition group"
                                                >
                                                    <td className="p-4 border-l border-r border-gray-100">
                                                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                                            {item.variants?.[0]?.images?.[0]?.image_url ? (
                                                                <img
                                                                    src={item.variants[0].images[0].image_url}
                                                                    alt={item.productName}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-gray-400">No Img</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="p-4 border-r border-gray-100">
                                                        <div className="font-medium text-gray-900">{item.productName}</div>
                                                    </td>

                                                    <td className="p-4 border-r border-gray-100">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                                            {item.category?.categoryName || "Uncategorized"}
                                                        </span>
                                                    </td>

                                                    <td className="p-4 text-center border-r border-gray-100">
                                                        <button
                                                            onClick={() => handleViewDetails(item)}
                                                            className="flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50 cursor-pointer w-full"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>

                                                    <td className="p-4 text-center border-r border-gray-100 align-middle">
                                                        <div className="flex justify-center">
                                                            {item.isListed ? (
                                                                <button
                                                                    onClick={() => handleToggleList(item)}
                                                                    disabled={isToggling}
                                                                    className="bg-[#6BCB37] relative inline-flex h-8 w-24 items-center justify-between rounded-full transition-colors focus:outline-none px-1"
                                                                >
                                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider ml-2">
                                                                        Unlist
                                                                    </span>
                                                                    <span className="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleToggleList(item)}
                                                                    disabled={isToggling}
                                                                    className="bg-red-500 relative inline-flex h-8 w-24 items-center justify-between rounded-full transition-colors focus:outline-none px-1"
                                                                >
                                                                    <span className="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform" />
                                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider mr-4">
                                                                        List
                                                                    </span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="p-4 border-r border-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                to={`/admin/products/edit-product/${item._id}`}
                                                                className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition shadow-sm"
                                                            >
                                                                <Edit size={16} />
                                                            </Link>
                                                            <button
                                                                onClick={() => onDeleteClick(item)}
                                                                className={`p-2 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 text-red-500 transition shadow-sm ${isDeleting && "cursor-not-allowed opacity-50"}`}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center border border-gray-200">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                                                        <Search size={24} className="text-gray-400" />
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-900">No products found</p>
                                                    <p className="text-sm">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Showing {totalProducts === 0 ? 0 : startItem}-{endItem} from {totalProducts}
                    </span>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                <div className="w-full max-w-sm p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-50 p-3 rounded-full">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            onClick={() => setOpenConfirmModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-colors disabled:cursor-not-allowed"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </ConfirmModal>

            <ProductDetailsModal
                open={openDetailsModal}
                onClose={() => setOpenDetailsModal(false)}
                product={selectedProduct}
            />
        </>
    );
};

export default ProductList;
