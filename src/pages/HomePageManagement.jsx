// src/pages/HomePageManagement.jsx
import { useState } from "react";
import {
  Eye,
  Calendar,
  Upload,
  Settings,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";

export function HomePageManagement() {
  // Banner form states (dummy initial values)
  const [bannerTitle, setBannerTitle] = useState("Welcome to FreshCart");
  const [bannerSubtitle, setBannerSubtitle] = useState("Fresh groceries delivered to your door in minutes");
  const [ctaButtonText, setCtaButtonText] = useState("Shop Now");
  const [bannerImage, setBannerImage] = useState(null);

  // Dummy published banner for preview
  const [publishedBanner] = useState({
    title: "Summer Sale is Live!",
    subtitle: "Get 20% off on all fruits & vegetables",
    ctaText: "Shop Deals",
    image: null, // can be set to real preview image
  });

  // Modal open states
  const [showBannerSettings, setShowBannerSettings] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBannerRulesModal, setShowBannerRulesModal] = useState(false);
  const [showCategorySettings, setShowCategorySettings] = useState(false);
  const [showSpecialOfferSettings, setShowSpecialOfferSettings] = useState(false);
  const [showTopProductsSettings, setShowTopProductsSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Dummy section data
  const sections = [
    { id: 1, name: "Featured Categories", status: "Visible" },
    { id: 2, name: "Special Offers", status: "Scheduled" },
    { id: 3, name: "Top Products", status: "Time-based" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBannerImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    alert("Draft saved successfully! (UI only)");
  };

  const handlePublish = () => {
    alert("Banner published successfully! (UI only)");
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  // Reusable small components
  function LoadingSkeleton() {
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl" />
        <div className="h-96 w-full bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  function BannerPreview({ title, subtitle, ctaText, image }) {
    return (
      <div
        className="relative rounded-xl overflow-hidden min-h-[100px] flex items-center justify-between px-6 py-6"
        style={{
          background: image
            ? `linear-gradient(90deg, rgba(79, 70, 229, 0.92) 0%, rgba(99, 102, 241, 0.92) 100%), url(${image})`
            : "linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: image ? "overlay" : "normal",
        }}
      >
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
          <p className="text-white text-base opacity-90">{subtitle}</p>
        </div>
        <button className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg text-base hover:bg-gray-100 transition">
          {ctaText}
        </button>
      </div>
    );
  }

  function ImageUploader({ image, onUpload, onRemove }) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        {image ? (
          <div className="space-y-4">
            <img src={image} alt="preview" className="max-h-48 mx-auto rounded-lg shadow" />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => document.getElementById("banner-upload")?.click()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                Change Image
              </button>
              <button
                onClick={onRemove}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click or drag image here</p>
            <p className="text-sm text-gray-500 mb-4">PNG, JPG • max 5MB</p>
            <label htmlFor="banner-upload">
              <button
                type="button"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("banner-upload")?.click();
                }}
              >
                Upload Image
              </button>
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
            />
          </>
        )}
      </div>
    );
  }

  function PageSectionItem({ title, status = "Visible", children, onSettings, onEdit, onCopy, onDelete }) {
    return (
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <h4 className="font-medium text-sm">{title}</h4>
            {status !== "Visible" && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                {status}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onSettings} className="text-gray-500 hover:text-indigo-600">
              <Settings size={16} />
            </button>
            <button onClick={onEdit} className="text-gray-500 hover:text-indigo-600">
              <Edit size={16} />
            </button>
            <button onClick={onCopy} className="text-gray-500 hover:text-indigo-600">
              <Copy size={16} />
            </button>
            <button className="text-green-600">
              <Eye size={16} />
            </button>
            <button onClick={onDelete} className="text-red-600 hover:text-red-800">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-5">{children}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Homepage Management</h1>
          <p className="text-gray-600 mt-1">Customize banners, sections & visibility rules</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">
            <Eye size={16} />
            Preview Mode
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-5 py-2.5 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 shadow-sm"
          >
            Save Draft
          </button>
          <button
            onClick={handleSchedule}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-sm"
          >
            <Calendar size={16} />
            Schedule
          </button>
          <button
            onClick={handlePublish}
            className="px-6 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm font-medium"
          >
            Publish Now
          </button>
        </div>
      </div>

      {/* Top Banner Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Banner</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowBannerRulesModal(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Visibility Rules
            </button>
            <button className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1.5">
              <Eye size={16} /> Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Welcome to FreshCart"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Fresh groceries delivered in minutes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={ctaButtonText}
                onChange={(e) => setCtaButtonText(e.target.value)}
                placeholder="Shop Now"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <ImageUploader
                image={bannerImage}
                onUpload={handleImageUpload}
                onRemove={() => setBannerImage(null)}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
            <BannerPreview
              title={bannerTitle}
              subtitle={bannerSubtitle}
              ctaText={ctaButtonText}
              image={bannerImage}
            />
          </div>
        </div>
      </div>

      {/* Page Sections */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Page Sections</h2>
          <select className="text-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 bg-white">
            <option>Add New Section...</option>
            <option>Featured Categories</option>
            <option>Top Products</option>
            <option>Special Offers</option>
            <option>Custom Banner</option>
          </select>
        </div>

        <div className="space-y-6">
          {/* Featured Categories */}
          <PageSectionItem
            title="Featured Categories"
            status="Visible"
            onSettings={() => setShowCategorySettings(true)}
            onEdit={() => alert("Edit featured categories (placeholder)")}
            onCopy={() => alert("Duplicated (placeholder)")}
            onDelete={() => setShowDeleteModal(true)}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {["Milk", "Dairy", "Beverages", "Snacks"].map((cat) => (
                <div key={cat} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🥛</div>
                  <p className="text-sm font-medium">{cat}</p>
                </div>
              ))}
            </div>
          </PageSectionItem>

          {/* Special Offers */}
          <PageSectionItem
            title="Special Offers"
            status="Scheduled"
            onSettings={() => setShowSpecialOfferSettings(true)}
            onEdit={() => alert("Edit special offer (placeholder)")}
            onCopy={() => alert("Duplicated (placeholder)")}
            onDelete={() => setShowDeleteModal(true)}
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Summer Mega Sale!</h3>
              <p className="text-lg mb-4">Use code SUMMER25 for 25% off</p>
              <div className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-bold text-base">
                SUMMER25
              </div>
            </div>
          </PageSectionItem>

          {/* Top Products */}
          <PageSectionItem
            title="Top Products"
            status="Time-based"
            onSettings={() => setShowTopProductsSettings(true)}
            onEdit={() => alert("Edit top products (placeholder)")}
            onCopy={() => alert("Duplicated (placeholder)")}
            onDelete={() => setShowDeleteModal(true)}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <span className="text-5xl">🍎</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium">Fresh Apple</p>
                    <p className="text-xs text-gray-600">₹120 / kg</p>
                  </div>
                </div>
              ))}
            </div>
          </PageSectionItem>
        </div>
      </div>

      {/* Banner Settings Modal */}
      {showBannerSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Banner Settings</h3>
              <button onClick={() => setShowBannerSettings(false)}>
                <X size={24} className="text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                  <option>Always Visible</option>
                  <option>Time-based</option>
                  <option>Date-based</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowBannerSettings(false)}
                  className="px-6 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Example placeholder for Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Schedule Publication</h3>
              <button onClick={() => setShowScheduleModal(false)}>
                <X size={24} className="text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}