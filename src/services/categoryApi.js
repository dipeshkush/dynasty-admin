// src/services/categoryApi.js

import { apiSlice } from "./apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ================= GET ALL CATEGORIES =================
    getCategories: builder.query({
      query: () => "/api/admin/get-categories",
      providesTags: ["Categories"],
    }),

    // ================= GET CATEGORY BY ID =================
    getCategoryById: builder.query({
      query: (id) => `/api/admin/get-categories/${id}`,
      providesTags: ["Categories"],
    }),

    // ================= CREATE CATEGORY =================
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/api/admin/create-category",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),

    // ================= UPDATE CATEGORY =================
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/admin/update-category/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),

    // ================= DELETE CATEGORY =================
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/admin/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

  }),
});


// ================= EXPORT HOOKS =================

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;