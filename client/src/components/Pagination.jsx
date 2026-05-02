import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <button
                onClick={() => {
                    onPageChange(Math.max(1, currentPage - 1));
                    window.scrollTo(0, 0);
                }}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 border border-transparent"
            >
                <ChevronLeft size={16} />
            </button>

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

            <button
                onClick={() => {
                    onPageChange(Math.min(totalPages, currentPage + 1));
                    window.scrollTo(0, 0);
                }}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 border border-transparent"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
