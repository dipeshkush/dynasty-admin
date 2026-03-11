// src/components/modal/AddProductModal.jsx

import { useState } from "react";
import { Check, X, Upload, ChevronDown, Loader } from "lucide-react";

// Dummy categories (replace with real ones from API)
const dummyCategories = [
  { id: "dairy", name: "Dairy" },
  { id: "beverages", name: "Beverages" },
  { id: "grains", name: "Grains" },
  { id: "spices", name: "Spices" },
];

export function AddProductModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    cost: "",
    stock: "",
    volume: "",
    discountPercent: "",
    isVIP: false,
    availableForOrder: true,
    vegetarian: false,
    description: "",
    mainImage: null,
    benefits: [],
    attributes: [],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      cost: "",
      stock: "",
      volume: "",
      discountPercent: "",
      isVIP: false,
      availableForOrder: true,
      vegetarian: false,
      description: "",
      mainImage: null,
      benefits: [],
      attributes: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageChange = (data) => {
    setFormData((prev) => ({ ...prev, mainImage: data }));
  };

  const addTag = (field, value) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeTag = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category || !formData.price || !formData.stock) {
      alert("Please fill in all required fields (Name, Category, Price, Stock)");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Product added successfully! (dummy save)");
      if (onSuccess) onSuccess(formData);
      onClose();
      resetForm();
    }, 1200);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-hidden"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-4 border-b bg-white shadow-sm flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details to create a new product in the system.
          </p>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50/40 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-10">
            {/* Image Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">Main Product Image</label>
              {formData.mainImage ? (
                <div className="relative w-full h-32 border rounded-xl overflow-hidden group bg-gray-50">
                  <img
                    src={formData.mainImage.preview || formData.mainImage.value}
                    alt="Preview"
                    className="w-full h-full object-contain p-4"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, mainImage: null }))}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 text-red-600 rounded-full hover:bg-red-50 shadow-md border transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-xl h-32 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-base font-medium text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, max 5MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      handleMainImageChange({ type: "file", value: file, preview });
                    }
                  }} />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-white p-5 rounded-xl shadow-sm space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="e.g. Butter Chicken"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={handleChange}
                      name="category"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 appearance-none pr-10"
                      required
                    >
                      <option value="">Select Category</option>
                      {dummyCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Selling Price <span className="text-red-500 text-xs">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    name="price"
                    placeholder="499"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Original Price
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    name="originalPrice"
                    placeholder="599"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cost Price
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={handleChange}
                    name="cost"
                    placeholder="350"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Stock <span className="text-red-500 text-xs">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    name="stock"
                    placeholder="e.g. 50"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Volume/Size
                  </label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={handleChange}
                    name="volume"
                    placeholder="e.g. 1L Bottle"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={handleChange}
                    name="discountPercent"
                    placeholder="e.g. 20"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={handleChange}
                name="description"
                placeholder="Product details, features, benefits, usage instructions..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all min-h-[100px] resize-y"
              />
            </div>

            {/* Tags - Benefits & Attributes */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <label className="block text-sm font-medium text-gray-700">Benefits (Optional)</label>
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[80px] flex flex-wrap gap-2 items-start">
                  {formData.benefits.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag("benefits", i)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[140px] outline-none text-sm px-2 py-1.5 bg-transparent"
                    placeholder="Add benefit + Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTag("benefits", e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <label className="block text-sm font-medium text-gray-700">Attributes (Optional)</label>
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[80px] flex flex-wrap gap-2 items-start">
                  {formData.attributes.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag("attributes", i)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[140px] outline-none text-sm px-2 py-1.5 bg-transparent"
                    placeholder="Add attribute + Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTag("attributes", e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Product Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div
                  onClick={() => setFormData((prev) => ({ ...prev, availableForOrder: !prev.availableForOrder }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-sm ${
                    formData.availableForOrder ? "border-green-300 bg-green-50/60" : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-colors ${
                        formData.availableForOrder ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      {formData.availableForOrder && <Check className="h-4 w-4" />}
                    </div>
                    <span className={`text-sm font-medium ${formData.availableForOrder ? "text-gray-900" : "text-gray-600"}`}>
                      Available for Order
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setFormData((prev) => ({ ...prev, vegetarian: !prev.vegetarian }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-sm ${
                    formData.vegetarian ? "border-green-300 bg-green-50/60" : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-colors ${
                        formData.vegetarian ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      {formData.vegetarian && <Check className="h-4 w-4" />}
                    </div>
                    <span className={`text-sm font-medium ${formData.vegetarian ? "text-gray-900" : "text-gray-600"}`}>
                      Vegetarian
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setFormData((prev) => ({ ...prev, isVIP: !prev.isVIP }))}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-sm ${
                    formData.isVIP ? "border-purple-300 bg-purple-50/60" : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-colors ${
                        formData.isVIP ? "bg-purple-500 border-purple-500 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      {formData.isVIP && <Check className="h-4 w-4" />}
                    </div>
                    <span className={`text-sm font-medium ${formData.isVIP ? "text-gray-900" : "text-gray-600"}`}>
                      VIP Only Product
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 px-6 py-4 border-t bg-white flex justify-end gap-3 shadow-lg flex-shrink-0">
          <button
            type="button"
            onClick={() => !loading && onClose()}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}