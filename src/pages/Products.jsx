// src/pages/Products.jsx

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  TrendingUp,
  Star,
  Crown,
  ChevronDown,
  Layers,
  RefreshCw,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddProductModal } from "../components/model/AddProductModal";   

import {
  useGetAllProductsQuery,
  useToggleProductExclusiveMutation,
  useDeleteProductMutation
} from "../services/productApi";

export function Products() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct] = useDeleteProductMutation();

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllProductsQuery();

  const products = productsData?.products || productsData?.data || productsData || [];

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.inStock || (p.stock ?? 0) > 0).length;
  const todaysRevenue = "₹12,450";
  const avgRating = products.length
    ? (products.reduce((sum, p) => sum + (Number(p.rating) || 0), 0) / products.length).toFixed(1)
    : "—";

  const [toggleProductExclusive, { isLoading: isToggling }] = useToggleProductExclusiveMutation();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (product.dishName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (product.category || "").toLowerCase() === selectedCategory.toLowerCase();

      let matchesStatus = true;
      if (selectedStatus === "instock") matchesStatus = product.inStock || (product.stock ?? 0) > 0;
      if (selectedStatus === "outofstock") matchesStatus = !(product.inStock || (product.stock ?? 0) > 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus, products]);

  const handleRefresh = () => refetch();

  const handleExport = () => {
    if (filteredProducts.length === 0) {
      alert("No products to export");
      return;
    }

    const headers = ["Name", "Price", "Stock", "Category", "Status"];
    const csvRows = [
      headers.join(","),
      ...filteredProducts.map((p) =>
        [
          `"${p.dishName || ""}"`,
          p.price || p.sellingPrice || 0,
          p.stock ?? 0,
          `"${p.category || ""}"`,
          p.inStock || (p.stock ?? 0) > 0 ? "In Stock" : "Out of Stock",
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Products exported successfully!");
  };

  const handleToggleExclusive = async (product) => {
    const productId = product._id || product.id;
    if (!productId) return alert("Product ID missing");

    try {
      await toggleProductExclusive({
        id: productId,
        isExclusive: !product.isExclusive,
      }).unwrap();

      alert(!product.isExclusive ? "Product marked as Exclusive!" : "Exclusive status removed.");
    } catch (err) {
      alert(err?.data?.message || "Failed to update exclusive status");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

const handleConfirmDelete = async () => {
  const productId = selectedProduct?._id || selectedProduct?.id;

  if (!productId) {
    alert("Cannot delete: Product ID missing");
    return;
  }

  try {
    await deleteProduct(productId).unwrap();

    alert("Product deleted successfully!");

    setDeleteModalOpen(false);
    setSelectedProduct(null);
  } catch (err) {
    console.error(err);
    alert(err?.data?.message || "Failed to delete product");
  }
};

  const handleModalSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-lg font-medium">Failed to load products</div>
        <p className="text-gray-500 mt-2">
          {error?.data?.message || error?.error || "Please check your connection or try again."}
        </p>
        <button
          onClick={refetch}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Products / Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product inventory, categories, and availability
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
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{availableProducts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{todaysRevenue}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{avgRating}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-400 transition-all"
          />
        </div>

        <div className="relative min-w-[160px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-400 appearance-none pr-8"
          >
            <option value="all">All Categories</option>
            <option value="Dairy">Dairy</option>
            <option value="Beverages">Beverages</option>
            <option value="Grains">Grains</option>
            <option value="Spices">Spices</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative min-w-[160px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-400 appearance-none pr-8"
          >
            <option value="all">All Status</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 flex flex-col h-full group"
            >
              <div className="relative h-48 bg-gray-50 border-b flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || "https://placehold.co/400x400/eee/999?text=No+Image"}
                  alt={product.dishName}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = "https://placehold.co/400x400/eee/999?text=No+Image")}
                />
                <span
                  className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm z-10"
                  style={{
                    backgroundColor: (product.inStock || (product.stock ?? 0) > 0) ? "#dcfce7" : "#fee2e2",
                    color: (product.inStock || (product.stock ?? 0) > 0) ? "#166534" : "#b91c1c",
                  }}
                >
                  {(product.inStock || (product.stock ?? 0) > 0) ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                  <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2">
                    {product.dishName || "Unnamed Product"}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize mb-3">{product.category || "—"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{(product.price || product.sellingPrice || 0).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{product.rating || "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => handleToggleExclusive(product)}
                    disabled={isToggling}
                    className={`flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      product.isExclusive
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Crown className="h-4 w-4" />
                  </button>

                  {/* <button
                    onClick={() => navigate(`/products/${product._id || product.id}/variants`)}
                    className="flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                  >
                    <Layers className="h-4 w-4" />
                  </button> */}

                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(product)}
                    className="flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
          No products found.
        </div>
      )}

      {/* Add Modal */}
      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Modal - CORRECTED */}
      <AddProductModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProduct(null);
        }}
        initialData={selectedProduct}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-5 bg-red-50 flex items-center gap-3 border-b">
              <Trash2 className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Delete Product?</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete{" "}
                <strong>{selectedProduct?.dishName || "this product"}</strong>?
              </p>
              <p className="text-sm text-red-600 font-medium">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2.5 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}