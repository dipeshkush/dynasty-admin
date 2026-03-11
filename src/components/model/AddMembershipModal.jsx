// src/components/modals/AddMembershipModal.jsx

import { useState } from "react";
import { X, Crown, Star, Percent, Truck, Shield, Zap, Diamond } from "lucide-react";

export function AddMembershipModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    originalPrice: "",
    discountPercent: "",
    benefitsText: "",
    icon: "Crown",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse benefits (one per line)
    const benefitsArray = formData.benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean)
      .map((b) => ({
        description: b,
        type: b.includes("%") ? "percentage_discount" : b.includes("₹") ? "flat_discount" : "access",
        value: b.match(/\d+/) ? Number(b.match(/\d+/)[0]) : 0,
      }));

    const durationMap = {
      "30 Days": 30,
      "60 Days": 60,
      "90 Days": 90,
      "1 Year Plan": 365,
    };

    const durationDays = durationMap[formData.duration] || 30;

    const originalPrice = Number(formData.originalPrice) || 0;
    const discountPercent = Number(formData.discountPercent) || 0;
    const discountPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    const savings = originalPrice - discountPrice;

    const payload = {
      name: formData.name.trim(),
      description: `Unlock premium benefits for ${formData.duration}.`,
      durationDays,
      originalPrice,
      discountPrice,
      discountPercent,
      savings: savings > 0 ? `You Save ₹${savings}` : "",
      isActive: true,
      isBestValue: false,
      benefits: benefitsArray,
      icon: formData.icon,
    };

    console.log("FINAL PAYLOAD:", payload);
    onSave(payload);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      duration: "",
      originalPrice: "",
      discountPercent: "",
      benefitsText: "",
      icon: "Crown",
    });
  };

  const discountPrice =
    formData.originalPrice && formData.discountPercent
      ? Math.round(formData.originalPrice * (1 - formData.discountPercent / 100))
      : "";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add New Membership Tier</h2>
            <p className="text-xs text-gray-500 mt-0.5">Define a new membership level</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="add-membership-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Tier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tier Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all bg-white"
                required
              >
                <option value="">Select Tier Name</option>
                <option value="Silver Elite">Silver Elite</option>
                <option value="Bronze Daily Saver">Bronze Daily Saver</option>
                <option value="Gold Pro">Gold Pro</option>
                <option value="Premium Plus">Premium Plus</option>
              </select>
            </div>

            {/* Original Price & Discount % */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Original Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange("originalPrice", e.target.value)}
                  placeholder="e.g. 999"
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) => handleChange("discountPercent", e.target.value)}
                  placeholder="e.g. 20"
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            {/* Discounted Price (auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Discounted Price (₹)
              </label>
              <input
                type="text"
                value={discountPrice ? `₹${discountPrice}` : ""}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all bg-white"
                required
              >
                <option value="">Select Duration</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="1 Year Plan">1 Year Plan</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tier Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all bg-white"
              >
                <option value="Crown">Crown (Gold/Platinum)</option>
                <option value="Star">Star (Silver)</option>
                <option value="Percent">Percent (Bronze)</option>
                <option value="Diamond">Diamond (Premium)</option>
                <option value="Truck">Truck (Delivery)</option>
                <option value="Shield">Shield (Security)</option>
                <option value="Zap">Zap (Fast)</option>
              </select>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Benefits (one per line) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.benefitsText}
                onChange={(e) => handleChange("benefitsText", e.target.value)}
                placeholder="e.g.&#10;10% off on all orders&#10;Free delivery above ₹999&#10;Priority support"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all min-h-[120px] resize-y"
                required
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-membership-form"
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Create Tier
          </button>
        </div>
      </div>
      
    </div>
  );
}