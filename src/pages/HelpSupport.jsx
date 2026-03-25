// src/pages/HelpSupport.jsx
import { useState } from "react";
import { Upload, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useSendSupportMailMutation } from "../services/supportApi";

export function HelpSupport() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [sendSupportMail, { isLoading }] = useSendSupportMailMutation();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize((selectedFile.size / 1024 / 1024).toFixed(2) + " MB");
    setError("");
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
    setFileSize("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("subject", subject.trim());
    formData.append("content", description.trim());
    if (file) {
      formData.append("image", file);
    }

    try {
      await sendSupportMail(formData).unwrap();
      setSuccess("Support request sent successfully! Our team will get back to you as soon as possible.");
      setSubject("");
      setDescription("");
      setFile(null);
      setFileName("");
      setFileSize("");
    } catch (err) {
      setError(err?.data?.message || "Failed to send support request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className=" mb-6">
          {/* <div className="inline-flex justify-center mb-2">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div> */}

          <div>
          <h1 className="text-xl font-semibold text-gray-900">How can we help you?</h1>
          <p className="text-sm text-gray-600 mt-1">
            Our support team is here to assist you.
          </p>
        </div>
        </div>

        {/* Main Content - Two big separate columns with gap */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT COLUMN - Contact Info Cards + Tips */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center gap-4 bg-gray-50/80 rounded-xl px-5 py-3.5 border border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-base font-medium text-gray-900">+91 9118811192</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 bg-gray-50/80 rounded-xl px-5 py-3.5 border border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">support@webseeder.in</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-4 bg-gray-50/80 rounded-xl px-5 py-3.5 border border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Working Hours</p>
                    <p className="text-base font-medium text-gray-900">Mon-Sat 9AM - 6PM IST</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 bg-gray-50/80 rounded-xl px-5 py-3.5 border border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-base font-medium text-gray-900">Indore, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card - Separate card */}
            <div className="bg-yellow-50 rounded-2xl shadow border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="text-xl font-semibold text-gray-900">Tips for faster resolution</h4>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 text-xl font-bold mt-0.5">•</span>
                  Provide detailed description of the issue
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 text-xl font-bold mt-0.5">•</span>
                  Attach relevant screenshots
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 text-xl font-bold mt-0.5">•</span>
                  Include steps to reproduce the problem
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-500 text-xl font-bold mt-0.5">•</span>
                  Mention browser/device information
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - Form in its own card */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center gap-3">
                  <CheckCircle size={20} />
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Please provide as much detail as possible about your issue..."
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y min-h-[120px]"
                  required
                />
                <p className="mt-2 text-xs text-gray-500 text-right">
                  {description.length}/500 characters (minimum 20)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Screenshots (Optional)
                </label>

                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <label className="cursor-pointer block">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-800">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-600 mt-2">
                        PNG, JPG, GIF or WebP (max. 5MB per image, up to 5 images)
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/gif,image/webp"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Upload size={28} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[320px]">{fileName}</p>
                        <p className="text-sm text-gray-600">{fileSize}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-3 hover:bg-red-50 rounded-full text-red-600 hover:text-red-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSubject("");
                    setDescription("");
                    setFile(null);
                    setFileName("");
                    setFileSize("");
                    setError("");
                    setSuccess("");
                  }}
                  className="px-10 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-12 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-3 min-w-[180px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}