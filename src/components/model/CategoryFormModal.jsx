// src/components/model/CategoryFormModal.jsx
import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export function CategoryFormModal({ open, onClose, onSubmit, initialData = null }) {
  const isEdit = !!initialData;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "",
    imageFile: null,
    imagePreview: "",
    removeImage: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode - pre-fill
        setFormData({
          name: initialData.name || "",
          displayName: initialData.displayName || initialData.name || "",
          description: "", 
          icon: initialData.icon || "",
          imageFile: null,
          imagePreview: initialData.image || "",
          removeImage: false,
        });
      } else {
        // Add mode - reset
        setFormData({
          name: "",
          displayName: "",
          description: "",
          icon: "",
          imageFile: null,
          imagePreview: "",
          removeImage: false,
        });
      }
    }
  }, [open, initialData]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        removeImage: false,
      }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, imagePreview: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
      removeImage: true,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.displayName.trim()) {
      alert("Name and Display Name are required");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("displayName", formData.displayName);
    submitData.append("icon", formData.icon || "");

    if (formData.imageFile) {
      submitData.append("image", formData.imageFile);
    }
    if (formData.removeImage) {
      submitData.append("removeImage", "true");
    }

    try {
      await onSubmit(submitData, isEdit);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      alert(err?.data?.message || "Failed to save category");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-hidden"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 border-b bg-white shadow-sm flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEdit ? "Update category details" : "Fill in the details to create a new category"}
          </p>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/40">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Image */}
            <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
              <label className="block text-sm font-medium text-gray-700">Category Image</label>

              <div
                className="h-48 w-48 mx-auto rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.imagePreview ? (
                  <>
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-500 font-medium text-center px-4">
                      Click to Upload Image
                    </span>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>

            {/* Fields */}
            <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Display Name <span className="text-red-500 text-xs">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  name="displayName"
                  placeholder="e.g. Fresh Dairy Products"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Internal Name (slug) <span className="text-red-500 text-xs">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  placeholder="e.g. dairy"
                  disabled={isEdit}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={handleChange}
                  name="icon"
                  placeholder="e.g. 🥛"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                  placeholder="Short description about this category..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 min-h-[100px] resize-y"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 px-6 py-4 border-t bg-white flex justify-end gap-3 shadow-lg flex-shrink-0">
          <button
            onClick={() => !loading && onClose()}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}