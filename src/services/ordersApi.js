// src/services/ordersApi.js
import { apiSlice } from "./apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Orders
    getAllOrders: builder.query({
      query: () => "/api/admin/all-orders",  
      providesTags: ["Orders"],
    }),

    // Update Order Status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/api/admin/orders/update-status/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ NEW: Export Orders
    exportOrders: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/api/admin/orders/export",
        method: "GET",
        params: { startDate, endDate },
        responseHandler: (response) => response.blob(),   
      }),
    }),

  }),
});

export const {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useLazyExportOrdersQuery,     
} = ordersApi;