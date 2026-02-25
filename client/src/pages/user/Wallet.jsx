import React, { useState } from 'react';
import { SpinnerBadge } from '@/components/Spinner';
import { useGetWallet } from '@/hooks/tanstack_Queries/user/wallet/useGetWallet';
import { format } from 'date-fns';
import Pagination from '@/components/Pagination';

const WalletPage = () => {
    const [page, setPage] = useState(1);
    const limit = 5;
    const { data, isLoading, error } = useGetWallet(page, limit);

    if (isLoading) {
        return <SpinnerBadge content={'Loading wallet...'} />;
    }

    if (error) {
        return (
            <div className="w-full">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-center">
                    Error loading wallet. Please try again later.
                </div>
            </div>
        );
    }

    const wallet = data?.wallet;
    const pagination = data?.pagination;
    const balance = wallet?.balance || 0;
    const transactions = wallet?.transactions || [];

    return (
        <div className="w-full pb-10">
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] sm:p-8 p-4 min-h-[600px] flex flex-col">
                <h1 className="text-3xl font-serif text-gray-900 mb-8">My Wallet</h1>
                <div className="border-[1.5px] border-gray-200 rounded-xl p-6 sm:p-8 mb-10">
                    <span className="text-gray-900 text-lg sm:text-xl tracking-wide">
                        Available wallet balance : <span className="ml-2 font-medium">₹{balance.toFixed(2)}</span>
                    </span>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-[#e4dfe0]">
                                <tr>
                                    <th className="py-4 px-4 font-medium text-gray-700 text-[12px] md:text-[13px] tracking-widest uppercase text-left">Transaction ID</th>
                                    <th className="py-4 px-4 font-medium text-gray-700 text-[12px] md:text-[13px] tracking-widest uppercase">Transaction Date</th>
                                    <th className="py-4 px-4 font-medium text-gray-700 text-[12px] md:text-[13px] tracking-widest uppercase">Amount</th>
                                    <th className="py-4 px-4 font-medium text-gray-700 text-[12px] md:text-[13px] tracking-widest uppercase text-left">Description</th>
                                    <th className="py-4 px-4 font-medium text-gray-700 text-[12px] md:text-[13px] tracking-widest uppercase">Debit / Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-gray-500 text-center">No transactions found.</td>
                                    </tr>
                                ) : (
                                    transactions.map((txn, idx) => (
                                        <tr key={txn._id || idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-4 text-sm text-gray-700 tracking-wide text-left">
                                                #{txn._id ? txn._id.substring(txn._id.length - 10).toUpperCase() : `TXN${idx}`}
                                            </td>
                                            <td className="py-5 px-4 text-sm text-gray-700 tracking-wide">
                                                {format(new Date(txn.date), 'dd - MM - yyyy')}
                                            </td>
                                            <td className="py-5 px-4 text-sm text-gray-700">
                                                ₹{txn.amount}
                                            </td>
                                            <td className="py-5 px-4 text-sm text-gray-700 text-left" title={txn.description}>
                                                {txn.description}
                                            </td>
                                            <td className={`py-5 px-4 text-[13px] tracking-wide font-medium ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-500'}`}>
                                                {txn.type === 'Credit' ? 'Amount Credited' : 'Amount Debited'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-auto pt-6 flex justify-center">
                        <Pagination 
                            currentPage={page}
                            totalPages={pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletPage;
