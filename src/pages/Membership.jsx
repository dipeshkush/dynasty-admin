import { useState } from "react";
import {
    Search,
    Edit2,
    Trash2,
    Crown,
    Percent,
    Truck,
    Star,
    RefreshCw,
    Download,
    Plus,
    Shield,
    Zap,
    Diamond,
    Loader2,
    ChevronDown,
    X,
} from "lucide-react";
import { AddMembershipModal } from "../components/model/AddMembershipModal";


// Dummy data (replace with real API data later)
const dummyMemberships = [
    {
        id: 1,
        name: "Bronze",
        durationDays: 30,
        originalPrice: 999,
        discountPrice: 799,
        icon: "Percent",
        benefits: [
            "5% discount on all orders",
            "Free delivery on orders above ₹500",
        ],
        isActive: true,
    },
    {
        id: 2,
        name: "Silver",
        durationDays: 90,
        originalPrice: 2499,
        discountPrice: 1999,
        icon: "Star",
        benefits: [
            "10% discount on all orders",
            "Priority support",
            "Free delivery on all orders",
        ],
        isActive: true,
    },
    {
        id: 3,
        name: "Gold",
        durationDays: 180,
        originalPrice: 4999,
        discountPrice: 3999,
        icon: "Crown",
        benefits: [
            "15% discount on all orders",
            "Exclusive early access to sales",
            "Dedicated account manager",
        ],
        isActive: true,
    },
    {
        id: 4,
        name: "Platinum",
        durationDays: 365,
        originalPrice: 9999,
        discountPrice: 7999,
        icon: "Diamond",
        benefits: [
            "20% discount on all orders",
            "VIP customer support 24/7",
            "Personalized recommendations",
        ],
        isActive: false,
    },
];

export function Membership() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("price-asc");

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Simulate API states (replace with real hook later)
    const loading = false;
    const error = null;

    // Filter + sort logic
    const filteredMemberships = dummyMemberships
        .filter((plan) =>
            plan.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "price-asc") return a.discountPrice - b.discountPrice;
            if (sortOrder === "price-desc") return b.discountPrice - a.discountPrice;
            if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
            if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
            return 0;
        });

    const handleRefresh = () => {
        alert("Refreshing membership tiers... (dummy)");
    };

    const handleExport = () => {
        alert("Exporting membership data... (dummy)");
    };

    const handleAddPlan = () => {
        setAddModalOpen(true);
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setEditModalOpen(true);
    };

    const handleDelete = (plan) => {
        setSelectedPlan(plan);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        alert(`Deleted "${selectedPlan.name}" tier (dummy)`);
        setDeleteModalOpen(false);
        setSelectedPlan(null);
    };

    // Tier icon helper
    const getTierIcon = (iconName) => {
        const base = "h-5 w-5 mr-2";
        switch (iconName) {
            case "Crown": return <Crown className={`${base} text-yellow-600`} />;
            case "Star": return <Star className={`${base} text-gray-500`} />;
            case "Percent": return <Percent className={`${base} text-amber-700`} />;
            case "Diamond": return <Diamond className={`${base} text-indigo-700`} />;
            default: return <Truck className={`${base} text-indigo-600`} />;
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Membership Tiers</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage membership plans and customer benefits
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw size={14} />
                        )}
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
                        onClick={() => setAddModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Add New Tier
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by tier name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border bg-gray-50 border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                        />
                    </div>

                    <div className="relative min-w-[200px]">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
                        >
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">TIER NAME</th>
                            <th className="px-6 py-3 text-left font-medium">DURATION</th>
                            <th className="px-6 py-3 text-left font-medium">ORIGINAL PRICE</th>
                            <th className="px-6 py-3 text-left font-medium">DISCOUNT PRICE</th>
                            <th className="px-6 py-3 text-left font-medium">DISCOUNT</th>
                            <th className="px-6 py-3 text-left font-medium">BENEFITS</th>
                            <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="h-32 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-red-600">
                                    Error: {error}
                                </td>
                            </tr>
                        ) : filteredMemberships.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-500">
                                    No membership tiers found
                                </td>
                            </tr>
                        ) : (
                            filteredMemberships.map((plan) => (
                                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-2">
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const base = "h-5 w-5";
                                                switch (plan.icon) {
                                                    case "Crown": return <Crown className={`${base} text-yellow-600`} />;
                                                    case "Star": return <Star className={`${base} text-gray-500`} />;
                                                    case "Percent": return <Percent className={`${base} text-amber-700`} />;
                                                    case "Diamond": return <Diamond className={`${base} text-indigo-700`} />;
                                                    default: return <Truck className={`${base} text-indigo-600`} />;
                                                }
                                            })()}
                                            <span className="font-medium">{plan.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-2 text-gray-600">{plan.durationDays} days</td>

                                    <td className="px-6 py-2 text-gray-500 line-through">
                                        ₹{plan.originalPrice.toLocaleString()}
                                    </td>

                                    <td className="px-6 py-2 font-semibold text-indigo-700">
                                        ₹{plan.discountPrice.toLocaleString()}
                                    </td>

                                    <td className="px-6 py-2">
                                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                                            {Math.round(((plan.originalPrice - plan.discountPrice) / plan.originalPrice) * 100)}% OFF
                                        </span>
                                    </td>

                                    <td className="px-6 py-2">
                                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                                            {plan.benefits.map((b, i) => (
                                                <li key={i}>{b}</li>
                                            ))}
                                        </ul>
                                    </td>

                                    <td className="px-6 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(plan)}
                                                className="p-1.5 hover:bg-indigo-50 rounded transition-colors"
                                            >
                                                <Edit2 size={16} className="text-indigo-600" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(plan)}
                                                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} className="text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <AddMembershipModal
                open={addModalOpen}
                onOpenChange={setAddModalOpen}
                onSave={(newPlan) => {
                    console.log("New membership plan saved:", newPlan);
                    alert("New tier added successfully! (dummy)");
                    // You can add it to state or call API here
                }}
            />
        </div>
    );
}