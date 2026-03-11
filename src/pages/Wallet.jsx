// src/pages/Wallet.jsx

import { useState } from 'react';
import {
    Search,
    ChevronDown,
    Eye,
    Edit2,
    Trash2,
    RefreshCw,
    Download,
    Plus,
    CreditCard,
    Percent,
    CheckCircle,
    Gift,
    Clock,
    CircleArrowUp,
    CircleArrowDown,
    Crown,
    Star,
    Diamond,
} from 'lucide-react';
import { AddDiscountBonusModal } from '../components/model/AddDiscountBonusModal';

// Dummy Discounts
const dummyDiscounts = [
    {
        id: 1,
        code: 'WELCOME50',
        title: 'Welcome Bonus 50% Off',
        type: 'Percentage',
        value: 50,
        status: 'active',
        redeemedCount: 124,
        usageLimit: 500,
        validFrom: '01/03/2026',
        validUntil: '31/03/2026',
    },
    {
        id: 2,
        code: 'FREESHIP100',
        title: 'Free Shipping on ₹1000+',
        type: 'Bonus',
        value: 1000,
        status: 'active',
        redeemedCount: 89,
        usageLimit: 200,
        validFrom: '01/03/2026',
        validUntil: '15/04/2026',
    },
    {
        id: 3,
        code: 'SUMMER30',
        title: 'Summer Sale 30% Off',
        type: 'Percentage',
        value: 30,
        status: 'scheduled',
        redeemedCount: 0,
        usageLimit: 300,
        validFrom: '01/05/2026',
        validUntil: '30/06/2026',
    },
    {
        id: 4,
        code: 'EXPIRED2025',
        title: 'Old Year Clearance',
        type: 'Fixed',
        value: 200,
        status: 'expired',
        redeemedCount: 456,
        usageLimit: 1000,
        validFrom: '01/01/2025',
        validUntil: '31/12/2025',
    },
];

// Dummy Transactions
const dummyTransactions = [
    {
        id: 'TXN-001',
        user: 'Rohit Sharma',
        type: 'credit',
        amount: 500,
        status: 'completed',
        date: '06/03/2026',
    },
    {
        id: 'TXN-002',
        user: 'Aarav Mehta',
        type: 'debit',
        amount: 1200,
        status: 'completed',
        date: '05/03/2026',
    },
    {
        id: 'TXN-003',
        user: 'Riya Patel',
        type: 'refund',
        amount: 300,
        status: 'pending',
        date: '04/03/2026',
    },
];

export function Wallet() {
    const [activeTab, setActiveTab] = useState('discounts');

    const [addDiscountModalOpen, setAddDiscountModalOpen] = useState(false);

    // Discount filters
    const [discountSearch, setDiscountSearch] = useState('');
    const [discountStatus, setDiscountStatus] = useState('all');
    const [discountType, setDiscountType] = useState('all');

    // Transaction filters
    const [transactionSearch, setTransactionSearch] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('all');
    const [transactionType, setTransactionType] = useState('all');

    // Filtered Discounts
    const filteredDiscounts = dummyDiscounts.filter((d) => {
        const query = discountSearch.toLowerCase();
        const matchesSearch = d.code.toLowerCase().includes(query) || d.title.toLowerCase().includes(query);

        const matchesStatus = discountStatus === 'all' || d.status === discountStatus;
        const matchesType = discountType === 'all' || d.type.toLowerCase() === discountType.toLowerCase();

        return matchesSearch && matchesStatus && matchesType;
    });

    // Filtered Transactions
    const filteredTransactions = dummyTransactions.filter((t) => {
        const query = transactionSearch.toLowerCase();
        const matchesSearch = t.id.toLowerCase().includes(query) || t.user.toLowerCase().includes(query);

        const matchesStatus = transactionStatus === 'all' || t.status === transactionStatus;
        const matchesType = transactionType === 'all' || t.type === transactionType;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Dummy stats (replace with real later)
    const walletStats = {
        totalDiscounts: 24,
        activeDiscounts: 12,
        totalRedeemed: 456,
        totalValue: 28500,
        totalWalletBalance: 124500,
        totalCredit: 87500,
        totalDebit: 38000,
    };

    const handleRefresh = () => {
        alert('Wallet data refreshed (dummy)');
    };

    const handleExport = () => {
        alert('Exporting wallet data... (dummy)');
    };

    const handleAddDiscount = () => {
        alert('Add Discount Modal would open here');
    };

    const handleEditDiscount = (discount) => {
        alert(`Editing discount: ${discount.code}`);
    };

    const handleDeleteDiscount = (discount) => {
        if (confirm(`Delete discount ${discount.code}?`)) {
            alert(`Discount ${discount.code} deleted`);
        }
    };

    const handleAddTransaction = () => {
        alert('Add Transaction Modal would open here');
    };

    const handleDeleteTransaction = (txn) => {
        if (confirm(`Delete transaction ${txn.id}?`)) {
            alert(`Transaction ${txn.id} deleted`);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Wallet Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage discounts, bonuses, wallet balance & transactions</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Download size={14} />
                        Export
                    </button>

                    <button
                        onClick={() => setAddDiscountModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Add New
                    </button>
                </div>
            </div>

            {/* Modern Pill Tabs - exact style from your screenshot */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1.5 shadow-inner">
                    <button
                        onClick={() => setActiveTab('discounts')}
                        className={`px-7 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${activeTab === 'discounts'
                            ? 'bg-white text-indigo-700 shadow-md'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                            }`}
                    >
                        Discounts / Bonus
                    </button>

                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-7 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${activeTab === 'transactions'
                            ? 'bg-white text-indigo-700 shadow-md'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                            }`}
                    >
                        Transactions
                    </button>
                </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'discounts' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Discounts</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{walletStats.totalDiscounts}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Percent size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Active Discounts</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{walletStats.activeDiscounts}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Redeemed</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{walletStats.totalRedeemed}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Gift size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Value Redeemed</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        ₹{walletStats.totalValue.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by code or title..."
                                value={discountSearch}
                                onChange={(e) => setDiscountSearch(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                            />
                        </div>

                        <div className="relative min-w-[160px]">
                            <select
                                value={discountStatus}
                                onChange={(e) => setDiscountStatus(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[160px]">
                            <select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
                            >
                                <option value="all">All Type</option>
                                <option value="Percentage">Percentage</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Bonus">Bonus</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Discounts Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">CODE</th>
                                    <th className="px-6 py-3 text-left font-medium">TYPE</th>
                                    <th className="px-6 py-3 text-left font-medium">VALUE</th>
                                    <th className="px-6 py-3 text-left font-medium">STATUS</th>
                                    <th className="px-6 py-3 text-left font-medium">REDEEMED</th>
                                    <th className="px-6 py-3 text-left font-medium">VALID FROM</th>
                                    <th className="px-6 py-3 text-left font-medium">VALID UNTIL</th>
                                    <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredDiscounts.map((discount) => (
                                    <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-2">
                                            <p className="font-medium">{discount.code}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{discount.title}</p>
                                        </td>

                                        <td className="px-6 py-2">
                                            <span
                                                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${discount.type === 'Bonus'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                                    }`}
                                            >
                                                {discount.type}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2 font-medium">
                                            {discount.type === 'Percentage' ? `${discount.value}%` : `₹${discount.value}`}
                                        </td>

                                        <td className="px-6 py-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${discount.status === 'active'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : discount.status === 'expired'
                                                        ? 'bg-gray-100 text-gray-700 border-gray-200'
                                                        : 'bg-blue-100 text-blue-700 border-blue-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-md ${discount.status === 'active'
                                                        ? 'bg-green-500'
                                                        : discount.status === 'expired'
                                                            ? 'bg-gray-500'
                                                            : 'bg-blue-500'
                                                        }`}
                                                />
                                                {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2">
                                            {discount.redeemedCount} / {discount.usageLimit}
                                        </td>

                                        <td className="px-6 py-2 text-gray-600">{discount.validFrom}</td>
                                        <td className="px-6 py-2 text-gray-600">{discount.validUntil}</td>

                                        <td className="px-6 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 hover:bg-indigo-50 rounded transition-colors">
                                                    <Edit2 size={14} className="text-indigo-600" />
                                                </button>
                                                <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 size={14} className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredDiscounts.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12 text-gray-500">
                                            No discounts found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Wallet Balance</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        ₹{walletStats.totalWalletBalance.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Credit (Top-up)</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        ₹{walletStats.totalCredit.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CircleArrowUp size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Total Debit (Spent)</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        ₹{walletStats.totalDebit.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <CircleArrowDown size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user or transaction ID..."
                                value={transactionSearch}
                                onChange={(e) => setTransactionSearch(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                            />
                        </div>

                        <div className="relative min-w-[160px]">
                            <select
                                value={transactionStatus}
                                onChange={(e) => setTransactionStatus(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[160px]">
                            <select
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
                            >
                                <option value="all">All Type</option>
                                <option value="credit">Credit (Top-up)</option>
                                <option value="debit">Debit (Purchase)</option>
                                <option value="refund">Refund</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">TRANSACTION ID</th>
                                    <th className="px-6 py-3 text-left font-medium">USER</th>
                                    <th className="px-6 py-3 text-left font-medium">TYPE</th>
                                    <th className="px-6 py-3 text-left font-medium">AMOUNT</th>
                                    <th className="px-6 py-3 text-left font-medium">STATUS</th>
                                    <th className="px-6 py-3 text-left font-medium">DATE</th>
                                    <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-2 font-medium">{txn.id}</td>
                                        <td className="px-6 py-2">{txn.user}</td>

                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-2">
                                                {txn.type === 'credit' && <CircleArrowUp className="h-4 w-4 text-green-600" />}
                                                {txn.type === 'debit' && <CircleArrowDown className="h-4 w-4 text-red-600" />}
                                                {txn.type === 'refund' && <RefreshCw className="h-4 w-4 text-indigo-600" />}
                                                <span className={txn.type === 'credit' ? 'text-green-700' : txn.type === 'debit' ? 'text-red-700' : 'text-indigo-700'}>
                                                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-2 font-medium">
                                            <span className={txn.type === 'credit' ? 'text-green-700' : 'text-red-700'}>
                                                {txn.type === 'debit' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2">
                                            <span
                                                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${txn.status === 'completed'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : txn.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                    }`}
                                            >
                                                {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2 text-gray-600">{txn.date}</td>

                                        <td className="px-6 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 size={14} className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AddDiscountBonusModal
                isOpen={addDiscountModalOpen}
                onClose={() => setAddDiscountModalOpen(false)}
                onAdd={(newDiscount) => {
                    console.log('New discount added:', newDiscount);
                    alert('Discount added successfully! (dummy)');
                }}
            />
        </div>
    );
}