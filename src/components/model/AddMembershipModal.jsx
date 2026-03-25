// src/components/model/AddMembershipModal.jsx

import { useState, useMemo, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export function AddMembershipModal({ open, onOpenChange, onSave, initialData = null }) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    originalPrice: "",
    discountPrice: "",
    description: "",
  });

  const [benefits, setBenefits] = useState([]);

  const [newBenefit, setNewBenefit] = useState({
    type: "percentage_discount",
    value: "",
    description: "",
  });

  // Days (number) → Label (string) mapping — for pre-fill in edit
  const durationLabelMap = {
    30: "30 Days",
    60: "60 Days",
    90: "90 Days",
    365: "1 Year Plan",
  };

  // Label → Days mapping — for submit payload
  const durationDaysMap = {
    "30 Days": 30,
    "60 Days": 60,
    "90 Days": 90,
    "1 Year Plan": 365,
  };

  // Get label from days (safe with Number conversion)
  const getDurationLabel = (days) => {
    const numDays = Number(days);
    if (isNaN(numDays)) return "";
    return durationLabelMap[numDays] || "";
  };

  useEffect(() => {
  if (open) {
    if (initialData) {
      // 1. Try durationDays first (if backend ever sends it)
      let days = initialData.durationDays;

      // 2. Fallback: guess from the "duration" string field
      if (!days && initialData.duration) {
        const durStr = String(initialData.duration).trim().toLowerCase();

        if (durStr.includes("30"))       days = 30;
        else if (durStr.includes("60"))  days = 60;
        else if (durStr.includes("90"))  days = 90;
        else if (durStr.includes("year") || durStr.includes("365")) days = 365;
      }

      // 3. Convert to label using your existing function
      const durationLabel = days ? getDurationLabel(days) : "";

      console.log("EDIT MODAL PRE-FILL:", {
        receivedDays: initialData.durationDays,
        fallbackDaysFromString: days,
        convertedDays: Number(days),
        selectedDuration: durationLabel,
        fullInitialData: initialData,
      });

      setFormData({
        name: initialData.name || "",
        duration: durationLabel,
        originalPrice: initialData.originalPrice?.toString() || "",
        discountPrice: initialData.discountPrice?.toString() || "",
        description: initialData.description || "",
        discountPercent: initialData.discountPercent || 0,
      });

      setBenefits(initialData.benefits || []);
    } else {
      // create mode
      setFormData({
        name: "",
        duration: "",
        originalPrice: "",
        description: "",
        discountPercent: 0,
      });
      setBenefits([]);
    }

    setNewBenefit({
      type: "percentage_discount",
      value: "",
      description: "",
    });
  }
}, [open, initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewBenefitChange = (field, value) => {
    setNewBenefit((prev) => ({ ...prev, [field]: value }));
  };

  const addBenefit = () => {
    if (!newBenefit.description.trim() || !newBenefit.value) {
      alert("Please fill benefit description and value");
      return;
    }

    setBenefits((prev) => [...prev, { ...newBenefit, value: Number(newBenefit.value) }]);

    setNewBenefit({
      type: "percentage_discount",
      value: "",
      description: "",
    });
  };

  const removeBenefit = (index) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-calculate discountPercent
  const discountPercent = useMemo(() => {
    const orig = Number(formData.originalPrice) || 0;
    const disc = Number(formData.discountPrice) || 0;

    if (orig <= 0 || disc >= orig || disc === 0) return 0;

    const percent = ((orig - disc) / orig) * 100;
    return Math.round(percent);
  }, [formData.originalPrice, formData.discountPrice]);

  // Savings
  const savings = useMemo(() => {
    const orig = Number(formData.originalPrice) || 0;
    const disc = Number(formData.discountPrice) || 0;
    return orig - disc;
  }, [formData.originalPrice, formData.discountPrice]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.duration !== "" &&
      Number(formData.originalPrice) > 0 &&
      Number(formData.discountPrice) >= 0 &&
      formData.discountPrice !== "" &&
      formData.description.trim() !== "" &&
      benefits.length > 0
    );
  }, [formData, benefits]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill all required fields and add at least one benefit");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      durationDays: durationDaysMap[formData.duration] || 30,
      originalPrice: Number(formData.originalPrice),
      discountPrice: Number(formData.discountPrice),
      discountPercent,
      savings: savings > 0 ? `You Save ₹${savings}` : "",
      isActive: true,
      isBestValue: false,
      benefits,
    };

    console.log("FINAL PAYLOAD:", payload);

    const planId = isEdit ? (initialData?._id || initialData?.id) : null;
    onSave(payload, planId);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit ? "Edit Membership Tier" : "Add New Membership Tier"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Define membership benefits and pricing</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-8">
          <form id="add-membership-form" onSubmit={handleSubmit}>
            {/* Tier Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Silver Monthly"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                required
              />
            </div>

            {/* Duration + Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Duration <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                  <option value="1 Year Plan">1 Year Plan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Original Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange("originalPrice", e.target.value)}
                  placeholder="e.g. 599"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                />
              </div>
            </div>

            {/* Discount Price (Manual) + Discount Percent (Auto) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => handleChange("discountPrice", e.target.value)}
                  placeholder="e.g. 399"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Percent (%) (Auto)
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Savings */}
            <div className="text-sm bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">You Save</p>
              <p className="font-semibold text-green-700">
                {savings > 0 ? `₹${savings.toLocaleString()}` : "—"}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Basic premium features for beginners..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all min-h-[100px] resize-y"
                required
              />
            </div>

            {/* Benefits - Dynamic List */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Benefits <span className="text-red-500">*</span>
              </label>

              {benefits.length > 0 && (
                <div className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {benefit.type === "percentage_discount" ? `${benefit.value}%` : `₹${benefit.value}`} - {benefit.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={newBenefit.type}
                      onChange={(e) => handleNewBenefitChange("type", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                    >
                      <option value="percentage_discount">Percentage Discount</option>
                      <option value="flat_discount">Flat Discount</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="number"
                      value={newBenefit.value}
                      onChange={(e) => handleNewBenefitChange("value", e.target.value)}
                      placeholder={newBenefit.type === "percentage_discount" ? "e.g. 10" : "e.g. 50"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newBenefit.description}
                      onChange={(e) => handleNewBenefitChange("description", e.target.value)}
                      placeholder="e.g. 10% off on all courses"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 min-w-[120px]"
                    >
                      <Plus className="h-5 w-5" />
                      Add
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Add one benefit at a time (for products). Type and value used for backend.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 sticky bottom-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-membership-form"
            disabled={!isFormValid}
            className={`px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
              isFormValid
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-400 cursor-not-allowed"
            }`}
          >
            {isEdit ? "Update Tier" : "Create Tier"}
          </button>
        </div>
      </div>
    </div>
  );
}