// src/components/modal/AddProductModal.jsx

import { useState, useEffect } from "react";
import { Check, X, Upload, ChevronDown, Loader } from "lucide-react";
import {
  useGetCategoriesQuery,
} from "../../services/categoryApi";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../services/productApi";

const units = ["ml", "kg", "gm"];

export function AddProductModal({ open, onClose, onSuccess, initialData = null }) {
  const isEdit = !!initialData;

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dishName: "",
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
    availableQuantities: [],
  });

  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery(undefined, { skip: !open });

  useEffect(() => {
    if (open && initialData && categoriesData?.categories?.length) {

      let categoryId = "";

      if (typeof initialData.category === "string" && initialData.category.length === 24) {
        categoryId = initialData.category;
      }

      else if (initialData.category?._id) {
        categoryId = initialData.category._id;
      }

      else {
        const match = categoriesData.categories.find(
          (cat) =>
            cat.name?.trim().toLowerCase() ===
            initialData.category?.trim().toLowerCase()
        );
        categoryId = match?._id || "";
      }

      setFormData((prev) => ({
        ...prev,
        dishName: initialData.dishName || "",
        category: categoryId, // ✅ ALWAYS ID
        price: initialData.price?.toString() || "",
        originalPrice: initialData.originalPrice?.toString() || "",
        cost: initialData.cost?.toString() || "",
        stock: initialData.stock?.toString() || "",
        volume: initialData.volume || "",
        discountPercent: initialData.discountPercent?.toString() || "",
        isVIP: initialData.isVIP || false,
        availableForOrder: initialData.availableForOrder !== false,
        vegetarian: initialData.vegetarian || false,
        description: initialData.description || "",
        mainImage: initialData.image ? { preview: initialData.image } : null,
        benefits: initialData.benefits || [],
        attributes: initialData.attributes || [],
        availableQuantities: initialData.availableQuantities || [],
      }));

    } else if (open && !initialData) {
      resetForm();
    }
  }, [open, initialData, categoriesData]);

  const resetForm = () => {
    setFormData({
      dishName: "",
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
      availableQuantities: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, mainImage: { file, preview } }));
    }
  };

  // Available Quantities Management
  const [newQuantity, setNewQuantity] = useState({
    label: "",
    value: "",
    unit: "ml",
    price: "",
    stock: "",
  });

  const addQuantity = () => {
    if (
      !formData.dishName?.trim() ||
      !formData.category ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required fields (Dish Name, Category, Price, Stock)");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      availableQuantities: [
        ...prev.availableQuantities,
        {
          label: newQuantity.label.trim(),
          value: Number(newQuantity.value),
          unit: newQuantity.unit,
          price: Number(newQuantity.price),
          stock: Number(newQuantity.stock),
        },
      ],
    }));

    setNewQuantity({
      label: "",
      value: "",
      unit: "ml",
      price: "",
      stock: "",
    });
  };

  const removeQuantity = (index) => {
    setFormData((prev) => ({
      ...prev,
      availableQuantities: prev.availableQuantities.filter((_, i) => i !== index),
    }));
  };

  // Benefits & Attributes
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM DATA STATE:", formData);
    // Validation
    if (
      !formData.dishName?.trim() ||
      !formData.category ||
      Number(formData.price) <= 0 ||
      Number(formData.stock) < 0
    ) {
      alert("Please fill all required fields (Dish Name, Category, Price, Stock)");
      return;
    }

    setLoading(true);

    // Prepare payload
    const payload = {
      dishName: formData.dishName.trim(),
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      cost: formData.cost ? Number(formData.cost) : undefined,
      stock: Number(formData.stock),
      volume: formData.volume?.trim() || undefined,
      discountPercent: formData.discountPercent ? Number(formData.discountPercent) : undefined,
      description: formData.description?.trim() || undefined,
      benefits: formData.benefits || [],
      attributes: formData.attributes || [],
      isVIP: formData.isVIP,
      vegetarian: formData.vegetarian,
      availableForOrder: formData.availableForOrder,
      availableQuantities: formData.availableQuantities || [],
    };

    const formDataToSend = new FormData();

    Object.keys(payload).forEach((key) => {
      const value = payload[key];

      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === "object") {
              formDataToSend.append(key, JSON.stringify(item)); // ✅ FIX
            } else {
              formDataToSend.append(key, item);
            }
          });
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    // Add image if new image is selected
    if (formData.mainImage?.file) {
      formDataToSend.append("image", formData.mainImage.file);
    }

    try {
      let result;

     if (isEdit) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-product/${initialData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // ✅ IMPORTANT
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload), // ✅ DIRECT OBJECT
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Update failed");
    }

    alert("Product updated successfully!");
    result = data;

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
} else {
        // ADD NEW PRODUCT
        result = await addProduct(formDataToSend).unwrap();
        alert("Product added successfully!");
      }

      if (onSuccess) onSuccess(result);
      onClose();
      resetForm();

    } catch (error) {
      console.error("Save Product Error:", error);
      const errorMsg =
        error?.data?.message || error?.message || "Failed to save product";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEdit
              ? "Update the product details below."
              : "Fill in the details to create a new product in the system."}
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
                    src={formData.mainImage.preview || formData.mainImage}
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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImageChange}
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-white p-5 rounded-xl shadow-sm space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dish Name <span className="text-red-500 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dishName}
                    onChange={handleChange}
                    name="dishName"
                    placeholder="e.g. Paneer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500 text-xs">*</span>
                  </label>
                  <div className="relative">
                    {categoriesLoading ? (
                      <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500">
                        Loading categories...
                      </div>
                    ) : categoriesError ? (
                      <div className="w-full px-4 py-2.5 border border-red-300 rounded-lg text-sm bg-red-50 text-red-700">
                        Failed to load categories
                      </div>
                    ) : (
                      <select
                        value={formData.category}
                        onChange={handleChange}
                        name="category"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 appearance-none pr-10"
                        required
                      >
                        <option value="">Select Category</option>
                        {(categoriesData?.categories || []).map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Rest of the form remains exactly the same */}
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
                    placeholder="40"
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
                    placeholder="45"
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
                    placeholder="35"
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
                    placeholder="100"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={handleChange}
                    name="volume"
                    placeholder="e.g. 200 gm Packet"
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
                    placeholder="e.g. 10"
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

            {/* Available Quantities */}
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <label className="block text-sm font-medium text-gray-700">Product Variants</label>
              <div className="space-y-3">
                {formData.availableQuantities.map((qty, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">
                        {qty.label} ({qty.value} {qty.unit}) - ₹{qty.price} (Stock: {qty.stock})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuantity(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {/* Add new quantity */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input
                    type="text"
                    value={newQuantity.label}
                    onChange={(e) => setNewQuantity({ ...newQuantity, label: e.target.value })}
                    placeholder="Label (e.g. 200gm packet)"
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    value={newQuantity.value}
                    onChange={(e) => setNewQuantity({ ...newQuantity, value: e.target.value })}
                    placeholder="Value"
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <select
                    value={newQuantity.unit}
                    onChange={(e) => setNewQuantity({ ...newQuantity, unit: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={newQuantity.price}
                    onChange={(e) => setNewQuantity({ ...newQuantity, price: e.target.value })}
                    placeholder="Price"
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    value={newQuantity.stock}
                    onChange={(e) => setNewQuantity({ ...newQuantity, stock: e.target.value })}
                    placeholder="Stock"
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={addQuantity}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Benefits & Attributes */}
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
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-sm ${formData.availableForOrder ? "border-green-300 bg-green-50/60" : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-colors ${formData.availableForOrder ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300"
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
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-sm ${formData.vegetarian ? "border-green-300 bg-green-50/60" : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-colors ${formData.vegetarian ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300"
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
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none shadow-sm ${formData.isVIP ? "border-purple-300 bg-purple-50/60" : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-colors ${formData.isVIP ? "bg-purple-500 border-purple-500 text-white" : "bg-white border-gray-300"
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

          {/* Sticky Footer - NEW (Correct) */}
          <button
            type="button"           // ← Important: type="button" rakhna
            onClick={handleSubmit}  // ← Sirf yeh line sahi hai
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {loading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Product" : "Add Product")}
          </button>
        </div>
      </div>
    </div>
  );
}