// src/components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl min-w-[100px] text-center">
          Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}