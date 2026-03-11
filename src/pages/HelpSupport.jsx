// src/pages/HelpSupport.jsx

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Search,
  Mail,
  Phone,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "How do I add a new product to the system?",
    answer:
      "To add a new product, navigate to the Products page from the sidebar, click on the 'Add Product' button in the top right corner, fill in all the required details including product name, category, price, and stock quantity, then click 'Save Product'. The product will be immediately available in the system.",
    category: "Products",
  },
  {
    id: 2,
    question: "How can I manage user permissions and roles?",
    answer:
      "Go to User Management from the sidebar, click on the edit icon next to any user, and you'll see the Permissions & Access section. Here you can assign different permissions across Core modules (Dashboard, Orders, Products, etc.), Analytics & Reports, Operations, and Development sections. Each permission controls access to specific features.",
    category: "User Management",
  },
  {
    id: 3,
    question: "How do I process and track orders?",
    answer:
      "Navigate to the Orders page where you can view all orders. Click 'Add Order' to create a new order, or use the edit icon to update order status. You can filter orders by status (Pending, Processing, Completed, Cancelled) and track delivery in real-time. Each order shows customer details, items, payment status, and delivery information.",
    category: "Orders",
  },
  {
    id: 4,
    question: "How can I view sales reports and analytics?",
    answer:
      "Access the Reports page from the sidebar to view comprehensive sales analytics. You can filter data by branch and date range, view revenue trends, top-selling products, order statistics, and customer insights. Export reports using the export button for further analysis.",
    category: "Reports & Analytics",
  },
  {
    id: 5,
    question: "How do I manage multiple branches in the system?",
    answer:
      "Go to Branch Management from the sidebar to add, edit, or remove branches. Each branch has its own details including location, contact information, and operational status. You can assign products and delivery staff to specific branches, and view branch-specific analytics in the Reports section.",
    category: "Branch Management",
  },
  {
    id: 6,
    question: "What should I do if I forgot my password?",
    answer:
      "On the login page, click on 'Forgot Password' link. Enter your registered email address, and you'll receive password reset instructions. Follow the link in the email to create a new password. If you don't receive the email, check your spam folder or contact your system administrator.",
    category: "Account & Security",
  },
];

const dummySupportQueries = [
  {
    id: "SQ001",
    customerName: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    query:
      "I am not receiving my daily milk delivery on time. The delivery person comes after 9 AM but I need it by 7 AM for my family breakfast. Please help resolve this issue.",
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
    ],
    status: "pending",
    createdAt: "2025-11-05 08:30 AM",
  },
  {
    id: "SQ002",
    customerName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    query:
      "The milk I received yesterday was not fresh. It had an unusual smell and taste. I have attached photos of the product. Please check the quality control.",
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    ],
    status: "resolved",
    createdAt: "2025-11-04 06:15 PM",
  },
  {
    id: "SQ003",
    customerName: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91 76543 21098",
    query:
      "I want to increase my daily order from 2 liters to 3 liters. Also, please add 500ml curd to my daily subscription. How can I modify my subscription plan?",
    images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400"],
    status: "pending",
    createdAt: "2025-11-03 10:45 AM",
  },
];

export function HelpSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [supportQueries, setSupportQueries] = useState(dummySupportQueries);

  const categories = ["all", ...new Set(faqs.map((faq) => faq.category))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleStatusChange = (queryId, newStatus) => {
    const updated = supportQueries.map((q) =>
      q.id === queryId ? { ...q, status: newStatus } : q
    );
    setSupportQueries(updated);
    alert(`Query marked as ${newStatus} (dummy)`);
  };

  const pendingCount = supportQueries.filter((q) => q.status === "pending").length;
  const resolvedCount = supportQueries.filter((q) => q.status === "resolved").length;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Find answers and manage customer queries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Queries</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{supportQueries.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending Queries</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <HelpCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Resolved Queries</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{resolvedCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            <span className="inline-flex px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
              {filteredFaqs.length} FAQs
            </span>
          </div>

          {/* Search + Filter */}
          <div className="mt-5 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 border border-gray-200 rounded-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
              />
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="p-4">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-start justify-between text-left group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {faq.category}
                  </span>
                </div>
                <div className="ml-4 pt-1">
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedFaq === faq.id && (
                <div className="mt-4 pl-8 text-gray-700 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No FAQs found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Support Queries */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Customer Support Queries</h2>
            <p className="text-sm text-gray-600 mt-1">
              Queries submitted by customers from mobile app
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-md">
              {pendingCount} Pending
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-md">
              {resolvedCount} Resolved
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {supportQueries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No support queries yet</p>
            </div>
          ) : (
            supportQueries.map((query) => (
              <div key={query.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900">{query.customerName}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-gray-400" />
                          {query.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-gray-400" />
                          {query.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-md ${
                      query.status === "pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {query.status === "pending" ? "Pending" : "Resolved"}
                  </span>
                </div>

                <div className="ml-[52px] mb-4">
                  <p className="text-gray-700 leading-relaxed text-sm">{query.query}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    {query.createdAt}
                  </div>
                </div>

                {/* Images */}
                {query.images?.length > 0 && (
                  <div className="ml-[52px] mb-4">
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <ImageIcon size={16} />
                      <span>
                        {query.images.length} Image{query.images.length > 1 ? "s" : ""} Attached
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {query.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(img, "_blank")}
                        >
                          <img src={img} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="ml-[52px] flex gap-3">
                  {query.status === "pending" ? (
                    <button
                      onClick={() => handleStatusChange(query.id, "resolved")}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <CheckCircle size={16} />
                      Mark as Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(query.id, "pending")}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XCircle size={16} />
                      Reopen Query
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}