// src/pages/Membership.jsx
import { useState } from "react";
import {
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Download,
  Plus,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { AddMembershipModal } from "../components/model/AddMembershipModal";

import {
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "../services/membershipApi";

function DeleteConfirmModal({ open, onClose, onConfirm, planName, isDeleting }) {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" 
      onClick={() => !isDeleting && onClose()}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-red-50 flex items-center gap-3 border-b">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Delete Membership Plan?</h3>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <strong>{planName || "this plan"}</strong>?
          </p>
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone. Active subscribers may be affected.
          </p>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => !isDeleting && onClose()}
            disabled={isDeleting}
            className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Membership() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, refetch } = useGetAllPlansQuery();
  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: deleting }] = useDeletePlanMutation();

  const plans = data?.plans || [];

  const filteredMemberships = plans
    .filter((plan) =>
      plan.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = a.discountPrice || a.originalPrice || 0;
      const priceB = b.discountPrice || b.originalPrice || 0;

      if (sortOrder === "price-asc") return priceA - priceB;
      if (sortOrder === "price-desc") return priceB - priceA;
      if (sortOrder === "name-asc") return a.name?.localeCompare(b.name) || 0;
      if (sortOrder === "name-desc") return b.name?.localeCompare(a.name) || 0;
      return 0;
    });

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    alert("Export functionality coming soon...");
  };

  const handleAddPlan = () => {
    setSelectedPlan(null);
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
const handleConfirmDelete = async () => {
  // Use whichever ID exists — backend returns "id"
  const planId = selectedPlan?.id || selectedPlan?._id;

  if (!planId) {
    console.error("No valid ID found on selected plan:", selectedPlan);
    alert("Cannot delete: Plan ID is missing. Please refresh and try again.");
    return;
  }

  setIsDeleting(true);
  try {
    console.log(`Deleting plan with ID: ${planId}`);
    await deletePlan(planId).unwrap();
    setDeleteModalOpen(false);
    setSelectedPlan(null);
    refetch();
  } catch (err) {
    console.error("Delete failed:", err);
    const errorMessage = err?.data?.message || err?.error || "Unknown error";
    alert(`Failed to delete plan: ${errorMessage}`);
  } finally {
    setIsDeleting(false);
  }
};

  const handleSave = async (payload, planId) => {
    try {
      console.log("Saving plan:", { isEdit: !!planId, payload, planId });

      if (planId) {
        // Update
        await updatePlan({ id: planId, ...payload }).unwrap();
      } else {
        // Create
        await createPlan(payload).unwrap();
      }

      setAddModalOpen(false);
      setEditModalOpen(false);
      setSelectedPlan(null);
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      alert(err?.data?.message || "Failed to save plan");
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
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Refresh
          </button>

          {/* <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={14} />
            Export
          </button> */}

          <button
            onClick={handleAddPlan}
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
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left font-medium">TIER NAME</th>
              <th className="px-6 py-4 text-left font-medium">DURATION</th>
              <th className="px-6 py-4 text-left font-medium">ORIGINAL PRICE</th>
              <th className="px-6 py-4 text-left font-medium">DISCOUNT PRICE</th>
              <th className="px-6 py-4 text-left font-medium">DISCOUNT</th>
              <th className="px-6 py-4 text-left font-medium">BENEFITS</th>
              <th className="px-6 py-4 text-right font-medium">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="h-64 text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-600" />
                  <p className="mt-4 text-gray-500">Loading membership plans...</p>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-red-600">
                  Failed to load membership tiers. Please try again.
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
                <tr key={plan.id || plan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {plan.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {(plan.duration || "").replace(/\s*Plan\s*/gi, "").trim() || "—"} Days
                  </td>

                  <td className="px-6 py-4 text-gray-500 line-through">
                    ₹{plan.originalPrice?.toLocaleString() || "—"}
                  </td>

                  <td className="px-6 py-4 font-semibold text-indigo-700">
                    ₹{plan.discountPrice?.toLocaleString() || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {plan.originalPrice && plan.discountPrice && plan.originalPrice > plan.discountPrice ? (
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                        {Math.round(((plan.originalPrice - plan.discountPrice) / plan.originalPrice) * 100)}% OFF
                      </span>
                    ) : (
                      "No Discount"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 max-w-xs">
                      {plan.benefits?.length > 0 ? (
                        plan.benefits.map((b, i) => (
                          <li key={i}>
                            {b.description || (typeof b === "string" ? b : "—")}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">No benefits listed</li>
                      )}
                    </ul>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 size={18} className="text-indigo-600" />
                      </button>

                      <button
                        onClick={() => handleDelete(plan)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Plan"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AddMembershipModal
        open={addModalOpen || editModalOpen}
        onOpenChange={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
          setSelectedPlan(null);
        }}
        onSave={handleSave}
        initialData={selectedPlan}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPlan(null);
        }}
        onConfirm={handleConfirmDelete}
        planName={selectedPlan?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}