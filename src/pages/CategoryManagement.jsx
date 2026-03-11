import { useState, useRef } from "react";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    FolderOpen,
    Upload,
    Check,
    Power,
    RefreshCw,
    Download,
    X,
    MoreVertical,
} from "lucide-react";
import { useEffect } from "react";

const dummyCategories = [
    {
        id: 1,
        name: "dairy",
        displayName: "Dairy Products",
        description: "Fresh milk, ghee, paneer, curd and more",
        image: "https://images.unsplash.com/photo-1626266060790-0d1b0d3c0b5f?w=400&auto=format&fit=crop&q=80",
        productCount: 28,
        isActive: true,
    },
    {
        id: 2,
        name: "beverages",
        displayName: "Beverages",
        description: "Tea, coffee, juices, soft drinks",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop&q=80",
        productCount: 45,
        isActive: true,
    },
    {
        id: 3,
        name: "grains",
        displayName: "Grains & Pulses",
        description: "Rice, wheat, lentils, millets",
        image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&auto=format&fit=crop&q=80",
        productCount: 19,
        isActive: true,
    },
    {
        id: 4,
        name: "spices",
        displayName: "Spices & Masalas",
        description: "Whole spices, ground masalas, blends",
        image: "https://images.unsplash.com/photo-1617890686219-509e1a4597e7?w=400&auto=format&fit=crop&q=80",
        productCount: 62,
        isActive: true,
    },
    {
        id: 5,
        name: "oils",
        displayName: "Edible Oils",
        description: "Mustard, coconut, sunflower, ghee",
        image: "https://images.unsplash.com/photo-1626266060790-0d1b0d3c0b5f?w=400&auto=format&fit=crop&q=80",
        productCount: 15,
        isActive: false,
    },
    {
        id: 6,
        name: "snacks",
        displayName: "Snacks & Namkeen",
        description: "Namkeen, biscuits, chips, sweets",
        image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&auto=format&fit=crop&q=80",
        productCount: 38,
        isActive: true,
    },
    {
        id: 7,
        name: "sweets",
        displayName: "Sweets & Mithai",
        description: "Gulab jamun, laddoo, barfi, halwa",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop&q=80",
        productCount: 22,
        isActive: true,
    },
];


function CategoryFormModal({ open, onClose, onSubmit, initialData = null }) {
    const isEdit = !!initialData;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(
        initialData
            ? {
                name: initialData.name || "",
                displayName: initialData.displayName || initialData.name || "",
                description: initialData.description || "",
                imageFile: null,
                imagePreview: initialData.image || "",
                isActive: initialData.isActive ?? true,
                removeImage: false,
            }
            : {
                name: "",
                displayName: "",
                description: "",
                imageFile: null,
                imagePreview: "",
                isActive: true,
                removeImage: false,
            }
    );

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.displayName.trim()) {
            alert("Name and Display Name are required");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            onSubmit(formData, isEdit);
            onClose();
        }, 800);
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
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 px-6 py-4 border-b bg-white shadow-sm flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? "Edit Category" : "Add New Category"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isEdit ? "Update category details" : "Fill in the details to create a new category"}
                    </p>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/40">
                    <form onSubmit={handleFormSubmit} className="space-y-4 ">
                        {/* Image Upload */}
                        <div className="bg-white p-5 rounded-xl shadow-sm space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Category Image
                            </label>

                            <div
                                className="h-48 w-48 mx-auto rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative transition-colors group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {formData.imagePreview ? (
                                    <>
                                        <img
                                            src={formData.imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
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
                        <div className="bg-white p-5 rounded-xl shadow-sm space-y-2">
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
                                    Internal Name <span className="text-red-500 text-xs">*</span>
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
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={handleChange}
                                    name="description"
                                    placeholder="Short description about this category..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all min-h-[100px] resize-y"
                                />
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="bg-white p-5 rounded-xl  shadow-sm">
                            <div
                                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 select-none ${formData.isActive ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${formData.isActive ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300"
                                            }`}
                                    >
                                        {formData.isActive && <Check className="h-4 w-4" />}
                                    </div>
                                    <span className={`text-sm font-medium ${formData.isActive ? "text-gray-900" : "text-gray-600"}`}>
                                        {formData.isActive ? "Category is Active" : "Category is Inactive"}
                                    </span>
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
                        onClick={handleFormSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader className="h-4 w-4 animate-spin" />}
                        {loading ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
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
  const [openMenuId, setOpenMenuId] = useState(null); 

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "",
    imageFile: null,
    imagePreview: "",
    isActive: true,
    removeImage: false,
  });

  const categories = dummyCategories;
  const loading = false;

  const filteredCategories = categories.filter((c) =>
    (c.displayName || c.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is not on any MoreVertical button or dropdown
      if (openMenuId !== null && !event.target.closest(".more-vertical-wrapper")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        displayName: category.displayName || category.name,
        description: category.description || "",
        icon: category.icon || "",
        imageFile: null,
        imagePreview: category.image || "",
        isActive: category.isActive ?? true,
        removeImage: false,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        displayName: "",
        description: "",
        icon: "",
        imageFile: null,
        imagePreview: "",
        isActive: true,
        removeImage: false,
      });
    }
    setModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file, removeImage: false }));
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.displayName) {
      alert("Name and Display Name are required");
      return;
    }
    alert(editingCategory ? "Category updated!" : "Category created!");
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      alert("Category deleted (dummy)");
    }
  };

  const handleExport = () => {
    alert("Exporting category data... (dummy)");
  };

  const handleRefresh = () => {
    alert("Refreshing categories... (dummy)");
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
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
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
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 relative"
              >
                {/* Image Area - no hover effect */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50/30">
                      <FolderOpen className="h-12 w-12 text-blue-300" />
                    </div>
                  )}

                  {/* MoreVertical icon - always visible */}
                  <div className="absolute top-2 right-2 z-10 more-vertical-wrapper">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === cat.id ? null : cat.id);
                        }}
                        className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-700" />
                      </button>

                      {/* Dropdown - only when this card's icon is clicked */}
                      {openMenuId === cat.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(cat);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(cat.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3
                    className="font-semibold text-gray-900 text-base truncate"
                    title={cat.displayName || cat.name}
                  >
                    {cat.displayName || cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {cat.productCount} items
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        cat.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data, isEdit) => {
          console.log("Form data submitted:", data);
          console.log("Is edit mode:", isEdit);
          alert(isEdit ? "Category updated successfully!" : "Category created successfully!");
        }}
        initialData={editingCategory}
      />
    </div>
  );
}