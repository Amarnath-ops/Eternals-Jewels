import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    // if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return (
                    <button
                        key={page}
                        onClick={() => {
                            onPageChange(page);
                            window.scrollTo(0, 0);
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                            currentPage === page
                                ? "bg-black text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent shadow-sm"
                        }`}
                    >
                        {page}
                    </button>
                );
            })}
        </div>
    );
};

export default Pagination;
