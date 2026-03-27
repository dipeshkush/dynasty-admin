// src/services/customerApi.js
import { apiSlice } from "./apiSlice";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

   // ✅ Get All Customers with Pagination
    getAllCustomers: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `/api/admin/get-customers?page=${page}&limit=${limit}`,

      providesTags: (result) =>
        result?.customers
          ? [
              ...result.customers.map((customer) => ({
                type: "Customers",
                id: customer._id,
              })),
              { type: "Customers", id: "LIST" },
            ]
          : [{ type: "Customers", id: "LIST" }],
    }),

    // ✅ Get Single Customer
    getSingleCustomer: builder.query({
      query: (id) => `/api/admin/get-single-customer/${id}`,
      providesTags: (result, error, id) => [
        { type: "Customers", id },
      ],
    }),

    // ✅ Toggle Customer Status 
    toggleCustomer: builder.mutation({
      query: (id) => ({
        url: `/api/admin/toggle-customer/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Customers", id },      
        { type: "Customers", id: "LIST" }, 
      ],
    }),

    // ✅ NEW: Export Customers API
    exportCustomers: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `/api/admin/customers/export?page=${page}&limit=${limit}`,
    }),

  }),
});

export const {
  useGetAllCustomersQuery,
  useGetSingleCustomerQuery,
  useToggleCustomerMutation,
  useLazyExportCustomersQuery,
} = customerApi;