import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { ArrowLeft, Loader2, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import {
    useGetWalletByCustomerIdQuery,
    useUpdateWalletBalanceMutation,
} from "../services/walletApi";

export function WalletDetail() {
    const { customerId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetWalletByCustomerIdQuery(customerId);
    const [updateWalletBalance, { isLoading: isUpdating }] = useUpdateWalletBalanceMutation();

    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const customer = data?.customer;
    const wallet = data?.wallet || { balance: 0, transactions: [] };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!amount.trim()) {
            setError("Amount is required");
            return;
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount === 0) {
            setError("Please enter a valid non-zero amount");
            return;
        }

        if (!note.trim()) {
            setError("Please provide a description/reason (e.g. Manual refund, Bonus credit)");
            return;
        }

        const transactionType = numAmount > 0 ? "credit" : "debit";
        const absoluteAmount = Math.abs(numAmount);

        setError("");
        setSuccess("");

        try {
            await updateWalletBalance({
                customerId,
                amount: absoluteAmount,
                type: transactionType,
                description: note.trim(),
            }).unwrap();

            setSuccess(`Balance ${numAmount > 0 ? "increased" : "decreased"} successfully!`);
            setAmount("");
            setNote("");
        } catch (err) {
            setError(err?.data?.message || "Failed to update balance");
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        );
    }

    if (isError || !customer) {
        return (
            <div className="p-6 text-center text-red-600 min-h-screen flex flex-col items-center justify-center">
                <AlertCircle size={48} className="mb-4" />
                <h2 className="text-xl font-bold">Failed to load wallet details</h2>
                <button
                    onClick={() => navigate("/wallet")}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Back to Wallets
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 mx-auto min-h-screen bg-gray-50">
            {/* Back Button */}
            <button
                onClick={() => navigate("/wallet")}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Wallets
            </button>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-300 bg-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {customer.fullName || "Unnamed Customer"}
                    </h1>
                    <p className="text-gray-700 mt-1">{customer.phone} • {customer.email}</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Current Balance</p>
                            <p className="text-3xl font-bold text-green-700 mt-1">
                                ₹{wallet.balance.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Transaction Count</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {wallet.transactionCount || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Balance Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="text-indigo-600" />
                    Update Wallet Balance
                </h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Adjustment Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g. 500 or -200"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                Positive = Add • Negative = Deduct
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Note / Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Refund, Manual adjustment, Bonus credit"
                                rows={1}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all resize-y"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isUpdating || !amount.trim()}
                            className="px-8 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2 font-medium"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating...
                                </>
                            ) : (
                                "Update Balance"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-300 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <History size={20} />
                        Transaction History
                    </h2>
                </div>

                {wallet.transactions?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No transactions yet
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {wallet.transactions.map((txn, index) => (
                            <div key={index} className="p-2 flex justify-between items-center px-6 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {txn.type?.charAt(0).toUpperCase() + txn.type?.slice(1) || "Transaction"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {txn.note || "No note provided"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {txn.date || new Date().toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                        {txn.type === "credit" ? "+" : "-"}₹{txn.amount?.toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}