// src/components/modals/CreateNotificationModal.jsx

import { useState, useRef } from "react";
import { Bell, Upload, X } from "lucide-react";

export function CreateNotificationModal({ open, onOpenChange, onSend }) {
  const [activeTab, setActiveTab] = useState("create");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Promotional",
    targetAudience: "All Users",
    image: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      alert("Title and Message are required");
      return;
    }
    if (onSend) onSend(formData);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New Notification</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Custom Tabs */}
          <div className="flex bg-gray-200 p-1 rounded-lg mt-4 w-fit">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "create"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "preview"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Create Tab */}
          <div className={activeTab === "create" ? "block" : "hidden"}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter notification title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter notification message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all min-h-[120px] resize-y bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 appearance-none pr-10"
                  >
                    <option>Promotional</option>
                    <option>System Alert</option>
                    <option>App Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 appearance-none pr-10"
                  >
                    <option>All Users</option>
                    <option>Active Users (Last 7 days)</option>
                    <option>Inactive Users</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image (Optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors h-40 relative overflow-hidden group bg-gray-50/50"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-600">Click to Upload Image</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG • max 5MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Tab */}
          <div className={activeTab === "preview" ? "flex flex-col items-center justify-center h-full min-h-[420px]" : "hidden"}>
            <div className="relative w-[280px] h-[520px] bg-black rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-100 transform scale-95">
              {/* Status Bar Mock */}
              <div className="absolute top-0 w-full h-8 bg-black text-white flex justify-between px-6 items-center text-[10px] font-medium z-20">
                <span>9:41</span>
                <span>100%</span>
              </div>

              {/* Screen Content */}
              <div className="w-full h-full bg-gray-100 pt-12 px-3 flex flex-col items-center">
                {/* Date Mock */}
                <div className="text-gray-400 text-[10px] mb-4 font-medium">Wednesday, 7 June</div>

                {/* Notification Toast */}
                <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex gap-3 animate-in slide-in-from-top-4 duration-500 mb-4">
                  <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Bell className="h-5 w-5 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-gray-900 truncate">Dynasty App</h4>
                      <span className="text-[10px] text-gray-400">now</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">
                      {formData.title || "Special Offer!"}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
                      {formData.message || "Get 50% off on your next order. Limited time offer!"}
                    </p>
                  </div>
                </div>

                {/* Mock App Background */}
                <div className="mt-auto mb-12 opacity-5">
                  <div className="text-6xl font-bold text-gray-900 text-center">12:30</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 font-medium">Lock Screen Preview</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}