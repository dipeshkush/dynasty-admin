// src/pages/Products.jsx

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  TrendingUp,
  Star,
  X,
  Crown,
  ChevronDown,
  Layers,
  RefreshCw,
  Download,
  Filter,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddProductModal } from "../components/model/AddProductModal";

// Dummy products with real-looking placeholder images (Unsplash)
const dummyProducts = [
  {
    id: 1,
    name: "Premium Desi Ghee 1L",
    image: "https://images.unsplash.com/photo-1626266060790-0d1b0d3c0b5f?w=500&auto=format&fit=crop&q=80",
    price: 499,
    stock: 45,
    category: "Dairy",
    inStock: true,
    isExclusive: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Organic Paneer 500g",
    image: "https://images.unsplash.com/photo-1626266060790-0d1b0d3c0b5f?w=500&auto=format&fit=crop&q=80",
    price: 299,
    stock: 120,
    category: "Dairy",
    inStock: true,
    isExclusive: false,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Pure Cow Milk 1L",
    image: "https://images.unsplash.com/photo-1550581190-9be9a4e8a1c3?w=500&auto=format&fit=crop&q=80",
    price: 65,
    stock: 0,
    category: "Dairy",
    inStock: false,
    isExclusive: false,
    rating: 4.2,
  },
  {
    id: 4,
    name: "Masala Chai Blend 250g",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&auto=format&fit=crop&q=80",
    price: 249,
    stock: 78,
    category: "Beverages",
    inStock: true,
    isExclusive: true,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Multigrain Atta 5kg",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500&auto=format&fit=crop&q=80",
    price: 399,
    stock: 32,
    category: "Grains",
    inStock: true,
    isExclusive: false,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Himalayan Pink Salt 1kg",
    image: "https://images.unsplash.com/photo-1617890686219-509e1a4597e7?w=500&auto=format&fit=crop&q=80",
    price: 149,
    stock: 0,
    category: "Spices",
    inStock: false,
    isExclusive: false,
    rating: 4.3,
  },
];



// ────────────────────────────────────────────────
// Main Products Page
// ────────────────────────────────────────────────
export function Products() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dummy stats
  const totalProducts = dummyProducts.length;
  const availableProducts = dummyProducts.filter((p) => p.inStock).length;
  const todaysRevenue = "₹12,450";
  const avgRating = "4.7";

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchesStatus = true;
      if (selectedStatus === "instock") matchesStatus = product.inStock;
      if (selectedStatus === "outofstock") matchesStatus = !product.inStock;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleRefresh = () => {
    alert("Refreshing product list... (dummy)");
  };

  const handleExport = () => {
    if (sortedProducts.length === 0) {
      alert("No products to export");
      return;
    }

    const headers = ["Name", "Price", "Stock", "Category", "Status"];
    const csvRows = [
      headers.join(","),
      ...sortedProducts.map((p) =>
        [p.name, p.price, p.stock, p.category, p.inStock ? "In Stock" : "Out of Stock"]
          .map((val) => `"${val}"`)
          .join(",")
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

    alert("Products exported as CSV!");
  };

  const handleToggleExclusive = (product) => {
    alert(
      product.isExclusive
        ? "Removed from Exclusive Products"
        : "Marked as Exclusive Product"
    );
  };

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
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
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

      {moreDropdownOpen && (
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedStatus("all");
              setMoreDropdownOpen(false);
              alert("All filters cleared (dummy)");
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={14} />
            Clear All
          </button>
        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 flex flex-col h-full group"
            >
              <div className="relative h-48 bg-gray-50 border-b flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400/eee/999?text=No+Image";
                  }}
                />
                <span
                  className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm z-10"
                  style={{
                    backgroundColor: product.inStock ? "#dcfce7" : "#fee2e2",
                    color: product.inStock ? "#166534" : "#b91c1c",
                    border: product.inStock ? "1px solid #86efac" : "1px solid #fca5a5",
                  }}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                  <h3
                    className="font-semibold text-base text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize mb-3">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => handleToggleExclusive(product)}
                    className={`flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${product.isExclusive
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Crown className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/products/${product.id}/variants`)}
                    className="flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    <Layers className="h-4 w-4" />
                    Variants
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setEditModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setDeleteModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
          No products found matching your filters.
        </div>
      )}


      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

    </div>
  );
}