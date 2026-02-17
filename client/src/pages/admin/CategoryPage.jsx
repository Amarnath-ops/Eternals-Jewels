import React, { useState } from "react";
import { Eye, Edit, Trash2, Search, Loader } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCategories } from "@/hooks/tanstack_Queries/admin/categories/useGetCategories";
import { SpinnerBadge } from "@/components/Spinner";
import { formatDate } from "@/lib/formatDate";
import ConfirmModal from "@/components/Modal";
import { useDeleteCategory } from "@/hooks/tanstack_Queries/admin/categories/useDeleteCategory";
import useToggleCategory from "@/hooks/tanstack_Queries/admin/categories/useToggleCategory";

const CategoryPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryId, setCategoryId] = useState(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [sort, setSort] = useState(1);
    const limit = 5;
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data: categories, isLoading } = useGetCategories({
        page: currentPage,
        limit,
        search: debouncedSearch,
        sort: "-createdAt",
    });
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();
    const { mutateAsync: toggleCategory, isPending } = useToggleCategory();

    const totalCustomers = categories?.total || 0;
    const totalPages = categories?.totalPages || 1;
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalCustomers);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };


    const onDeleteClick = (category) => {
        setCategoryId(category._id);
        setOpenConfirmModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(categoryId);
        } catch (error) {
            console.error(error);
        } finally {
            setOpenConfirmModal(false);
            setCategoryId(null);
        }
    };

    const handleToggleList = async (category) => {
        try {
            categories.categories.map((item) => {
                if (item._id === category._id) {
                    item.isListed = !item.isListed;
                }
            });

            await toggleCategory(category._id);
        } catch (error) {
            console.error(error);
            categories.categories.map((item) => {
                if (item._id === category._id) {
                    item.isListed = !item.isListed;
                }
            });
        }
    };
    return (
        <>
            <div className="flex-1 bg-white min-h-screen p-8 font-sans">
                {}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1 border-b-2 border-gray-800 inline-block pb-1">
                            CATEGORY
                        </h1>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <Link to="/admin/categories" className="hover:text-gray-800">
                                Category
                            </Link>
                            <ChevronRight size={16} className="mx-1" />
                            <span className="text-gray-900 font-medium">List</span>
                        </div>
                    </div>

                    <Link
                        to="add-categories"
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-lg"
                    >
                        Add Category
                    </Link>
                </div>

                {}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    {}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Search category name..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {}
                    <div className="flex items-center border rounded-md ps-4 text-sm font-medium">
                        <span className="mr-6 font-bold text-gray-900">Sort</span>
                        <button
                            className={`py-2 px-2 rounded-md text-gray-600 hover:text-green-700 transition ${sort === 1 && "bg-[#a3a3a338] "}`}
                            onClick={() => setSort(1)}
                        >
                            High Sale
                        </button>
                        <button
                            className={`py-2 px-2 rounded-md text-gray-600 hover:text-green-700 transition ${sort === 2 && "bg-[#a3a3a338] "}`}
                            onClick={() => setSort(2)}
                        >
                            Low Sale
                        </button>
                        <button
                            className={`py-2 px-2 rounded-md text-gray-600 hover:text-green-700 transition ${sort === 3 && "bg-[#a3a3a338] "}`}
                            onClick={() => setSort(3)}
                        >
                            Last added first
                        </button>
                    </div>
                </div>

                {}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-[#463102] text-white text-sm uppercase tracking-wide text-left">
                                <th className="p-4">SNO</th>
                                <th className="p-4">Category Name</th>
                                <th className="p-4">thumbnail</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Added</th>
                                <th className="p-4">List / Unlist</th>
                                <th className="p-4 text-center">Action</th>
                                <th className="p-4">Offer</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-8">
                                        <div className="flex justify-center items-center">
                                            <SpinnerBadge content={"Loading..."} />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {categories?.categories?.length > 0 ? (
                                        categories.categories.map((item, index) => (
                                            <tr
                                                key={item._id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                                            >
                                                <td className="p-4 font-medium">{(currentPage - 1) * limit + index + 1}</td>
                                                <td className="p-4 font-semibold text-gray-900">{item.categoryName}</td>
                                                <td className="p-4 ps-10">
                                                    <img
                                                        src={item?.thumbnail?.image_url}
                                                        alt="category image"
                                                        className="w-10 h-10 rounded-md"
                                                    />
                                                </td>
                                                <td className="p-4">{item.stock || "Nil"}</td>
                                                <td className="p-4 text-gray-500">{formatDate(item.createdAt)}</td>

                                                {}
                                                <td className="p-4">
                                                    {item.isListed ? (
                                                        <button
                                                            onClick={() => handleToggleList(item)}
                                                            disabled={isPending}
                                                            className="bg-[#20b100] text-white px-1.5 py-1.5 rounded-full flex items-center gap-2 w-24 justify-between hover:opacity-90 transition disabled:cursor-not-allowed"
                                                        >
                                                            <span className="text-xs font-bold ml-1">UNLIST</span>
                                                            <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleList(item)}
                                                            disabled={isPending}
                                                            className="bg-[#d40000] text-white px-1.5 py-1.5 rounded-full flex items-center gap-2 w-24 justify-between hover:opacity-90 transition disabled:cursor-not-allowed"
                                                        >
                                                            <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                                            <span className="text-xs font-bold mr-2">LIST</span>
                                                        </button>
                                                    )}
                                                </td>

                                                {}
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            to={`/admin/categories/edit-category/${item._id}`}
                                                            state={{category:item}}
                                                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-600 transition"
                                                        >
                                                            <Edit size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => onDeleteClick(item)}
                                                            className={`p-2 border border-gray-300 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-red-400 transition ${isPending && "cursor-not-allowed"}`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="p-4 font-medium text-gray-900">
                                                    {item.categoryOffer && item.categoryOffer + " %"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-gray-500">
                                                No categories found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <span className="text-sm text-gray-500">
                        Showing {totalCustomers === 0 ? 0 : startItem}-{endItem} from {totalCustomers}
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Category?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete this category? This action cannot be undone.
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
        </>
    );
};

export default CategoryPage;
