// src/services/productApi.js
import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get All Products
    getAllProducts: builder.query({
      query: () => ({
        url: "/api/admin/get-products",
        method: "GET",
      }),
      providesTags: ["Products"],
      transformResponse: (response) => {
        return response?.products || response?.data || response || [];
      },
    }),

    // Get Single Product
    getProductById: builder.query({
      query: (productId) => ({
        url: `/api/admin/get-product/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: "Products", id: productId },
      ],
    }),

    // Toggle Exclusive
   toggleProductExclusive: builder.mutation({
  query: ({ id, isExclusive }) => ({
    url: `/api/admin/product/${id}/exclusive`,
    method: "PUT", // ✅ FINAL FIX
    body: { isExclusive },
  }),
  invalidatesTags: (result, error, { id }) => [
    "Products",
    { type: "Products", id },
  ],
}),

    // Add Product
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/api/admin/add-product",
        method: "POST",
        body: productData, // FormData
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ FIXED Update Product
updateProduct: builder.mutation({
  query: ({ id, data }) => {
    return {
      url: `/api/admin/update-product/${id}`,
      method: "PUT",
      body: data, // FormData
      formData: true, 
    };
  },
}),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/admin/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useToggleProductExclusiveMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;