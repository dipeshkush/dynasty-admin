// src/services/ordersApi.js
import { apiSlice } from "./apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Orders
    getAllOrders: builder.query({
      query: () => "/api/admin/all-orders",  
      providesTags: ["Orders"],
    }),

    // Get Single Order Detail (NEW)
    getOrderDetail: builder.query({
      query: (orderId) => `/api/admin/order-detail/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "OrderDetail", id: orderId }],
    }),

    // Update Order Status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/api/admin/orders/update-status/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders", "OrderDetail"],
    }),

    // Export Orders
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
  useGetOrderDetailQuery,           
  useUpdateOrderStatusMutation,
  useLazyExportOrdersQuery,
} = ordersApi;