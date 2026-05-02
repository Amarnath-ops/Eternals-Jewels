import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronDown, Filter, X, Check } from "lucide-react";
import { useGetProducts } from "@/hooks/tanstack_Queries/user/products/useGetProducts";
import { useGetCategories } from "@/hooks/tanstack_Queries/user/categories/useGetCategories";
import { useGetMaterials } from "@/hooks/tanstack_Queries/user/products/useGetMaterials";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "@/components/user/ProductCard";
import { SpinnerBadge } from "@/components/Spinner";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
    const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get("category") ? searchParams.get("category").split(",") : [],
    );
    const [selectedMaterials, setSelectedMaterials] = useState(
        searchParams.get("material") ? searchParams.get("material").split(",") : [],
    );
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [appliedMinPrice, setAppliedMinPrice] = useState(searchParams.get("minPrice") || "");
    const [appliedMaxPrice, setAppliedMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 500);
    const limit = 12;

    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (sort !== "createdAt") params.set("sort", sort);
        if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
        if (selectedMaterials.length > 0) params.set("material", selectedMaterials.join(","));
        if (appliedMinPrice) params.set("minPrice", appliedMinPrice);
        if (appliedMaxPrice) params.set("maxPrice", appliedMaxPrice);
        setSearchParams(params, { replace: true });
    }, [currentPage, debouncedSearch, sort, selectedCategories, selectedMaterials, appliedMinPrice, appliedMaxPrice, setSearchParams]);

    const { data: productsData, isLoading: isProductsLoading } = useGetProducts({
        page: currentPage,
        limit,
        search: debouncedSearch,
        sort:
            sort === "priceHigh"
                ? "-variants.0.salePrice"
                : sort === "priceLow"
                ? "variants.0.salePrice"
                : sort === "a-z"
                    ? "productName"
                    : sort === "z-a"
                    ? "-productName"
                    : "-createdAt",
        category: selectedCategories.length > 0 ? selectedCategories : undefined,
        minPrice: appliedMinPrice,
        maxPrice: appliedMaxPrice,
        material: selectedMaterials.length > 0 ? selectedMaterials : undefined,
    });

    const { data: categoriesData } = useGetCategories();
    const { data: materials = [] } = useGetMaterials();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleCategoryChange = (catId) => {
        setSelectedCategories((prev) => {
            if (prev.includes(catId)) {
                return prev.filter((id) => id !== catId);
            }
            return [...prev, catId];
        });
        setCurrentPage(1);
    };

    const handleMaterialChange = (material) => {
        setSelectedMaterials((prev) => {
            if (prev.includes(material)) {
                return prev.filter((m) => m !== material);
            }
            return [...prev, material];
        });
        setCurrentPage(1);
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        setCurrentPage(1);
    };

    const handlePriceApply = () => {
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setSelectedMaterials([]);
        setSort("createdAt");
        setMinPrice("");
        setMaxPrice("");
        setAppliedMinPrice("");
        setAppliedMaxPrice("");
        setCurrentPage(1);
    };

    const totalPages = productsData?.totalPages || 1;

    return (
        <div className="bg-[#EAE5DF] min-h-screen font-sans text-gray-800">
            <Navbar />
            <div className="pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="What jewel are you looking for?"
                                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-transparent focus:border-black focus:ring-0 bg-white shadow-sm text-sm outline-none transition-all placeholder-gray-400"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {searchTerm ? (
                                    <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <Search size={18} className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 text-xs uppercase font-medium tracking-wide text-gray-500">
                            <span className="text-gray-400">Sort By:</span>
                            {[
                                { label: "Newest", value: "createdAt" },
                                { label: "Price Low to High", value: "priceLow" },
                                { label: "Price High to Low", value: "priceHigh" },
                                { label: "A-Z", value: "a-z" },
                                { label: "Z-A", value: "z-a" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSortChange(opt.value)}
                                    className={`${sort === opt.value ? "text-black font-bold border-b border-black pb-0.5" : "hover:text-gray-700"}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex lg:hidden gap-4 w-full">
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded text-sm font-medium"
                            >
                                <Filter size={16} /> Filters {showMobileFilters ? "(Hide)" : ""}
                            </button>
                            <div className="relative flex-1">
                                <select
                                    value={sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 py-2.5 px-4 rounded text-sm font-medium outline-none"
                                >
                                    <option value="createdAt">Newest</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                    <option value="a-z">A-Z</option>
                                    <option value="z-a">Z-A</option>
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div
                            className={`w-full lg:w-64 shrink-0 space-y-8 ${showMobileFilters ? "block" : "hidden lg:block"}`}
                        >
                            {" "}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Filter By</h3>
                                    {(selectedCategories.length > 0 ||
                                        selectedMaterials.length > 0 ||
                                        minPrice ||
                                        maxPrice ||
                                        searchTerm) && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-800">
                                        Categories
                                    </h4>
                                    <div className="space-y-3">
                                        {categoriesData?.data?.map((cat) => (
                                            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                                <div
                                                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat._id) ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-400"}`}
                                                >
                                                    {selectedCategories.includes(cat._id) && (
                                                        <Check size={12} className="text-white" strokeWidth={3} />
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedCategories.includes(cat._id)}
                                                    onChange={() => handleCategoryChange(cat._id)}
                                                />
                                                <span
                                                    className={`text-sm ${selectedCategories.includes(cat._id) ? "text-gray-900 font-medium" : "text-gray-500 group-hover:text-gray-700"}`}
                                                >
                                                    {cat.categoryName}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-800">
                                        Material
                                    </h4>
                                    <div className="space-y-3">
                                        {materials.map((mat) => (
                                            <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                                                <div
                                                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedMaterials.includes(mat) ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-400"}`}
                                                >
                                                    {selectedMaterials.includes(mat) && (
                                                        <Check size={12} className="text-white" strokeWidth={3} />
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedMaterials.includes(mat)}
                                                    onChange={() => handleMaterialChange(mat)}
                                                />
                                                <span
                                                    className={`text-sm ${selectedMaterials.includes(mat) ? "text-gray-900 font-medium" : "text-gray-500 group-hover:text-gray-700"}`}
                                                >
                                                    {mat}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-800">
                                        Price Range
                                    </h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:border-black"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:border-black"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handlePriceApply}
                                        className="w-full bg-black text-white text-xs py-2 rounded uppercase font-bold tracking-wider hover:bg-gray-800 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {isProductsLoading ? (
                                <div className="flex justify-center py-20">
                                    <SpinnerBadge content="Loading Jewels..." />
                                </div>
                            ) : productsData?.products?.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                                    {productsData.products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                        <Search size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        We couldn't find any jewel matching your search. Try different filters or terms.
                                    </p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                            {!isProductsLoading && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    className="mt-12 justify-center"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
