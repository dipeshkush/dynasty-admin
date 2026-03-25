// src/pages/CategoryManagement.jsx
import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FolderOpen,
  RefreshCw,
  Download,
  Loader2,
  X,
} from "lucide-react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../services/categoryApi";
import { CategoryFormModal } from "../components/model/CategoryFormModal";

// New Delete Confirmation Modal Component
function DeleteConfirmationModal({ open, onClose, onConfirm, categoryName, isDeleting }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={() => !isDeleting && onClose()}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b bg-red-50 flex items-center gap-3">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Confirm Deletion</h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this category?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <p className="font-medium text-gray-900">{categoryName || "Unnamed Category"}</p>
          </div>
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone. Products in this category may become uncategorized.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => !isDeleting && onClose()}
            disabled={isDeleting}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
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

export function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = apiData?.categories || [];

  const filteredCategories = categories.filter((c) =>
    (c.displayName || c.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSubmit = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await updateCategory({ id: editingCategory._id, formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Failed to save category");
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete._id).unwrap();
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete category");
    }
  };

  const handleRefresh = () => refetch();

  const handleExport = () => {
    alert("Export coming soon");
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Category Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage product categories and their hierarchy
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
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
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add Category
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-3">
            <Loader2 className="animate-spin" size={20} />
            Loading categories...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">Failed to load categories</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No categories found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 relative"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.displayName || cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50/30">
                      <FolderOpen className="h-12 w-12 text-blue-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 text-base truncate">
                    {cat.displayName || cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {cat.productCount || 0} products
                  </p>
                  {cat.icon && <p className="text-2xl mt-2">{cat.icon}</p>}
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-indigo-50 transition-colors"
                  >
                    <Edit2 size={16} className="text-indigo-600" />
                  </button>

                  <button
                    onClick={() => openDeleteModal(cat)}
                    disabled={isDeleting}
                    className={`p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-colors ${
                      isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50"
                    }`}
                  >
                    {isDeleting ? (
                      <Loader2 size={16} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={16} className="text-red-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        categoryName={categoryToDelete?.displayName || categoryToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// Helper function for delete modal trigger
function openDeleteModal(category) {
  setCategoryToDelete(category);
  setDeleteModalOpen(true);
}