// src/services/dashboardApi.js
import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Dashboard Stats
    getDashboardStats: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/admin/reports/admin-dashboard`,
        method: "GET",
        params: { startDate, endDate },
      }),
      transformResponse: (res) => res?.data || res,
      providesTags: ["Dashboard"],
    }),

    // ✅ Updated getTopProducts
    getTopProducts: builder.query({
      query: () => ({
        url: `/api/admin/reports/top-products`,
        method: "GET",
      }),
      transformResponse: (res) => {
        // Backend se 'topProducts' key ke andar data aa raha hai
        if (res?.topProducts) return res.topProducts;
        if (res?.data?.topProducts) return res.data.topProducts;
        if (res?.data) return res.data;
        return Array.isArray(res) ? res : [];
      },
    }),

   // ✅ FIXED for Recent Orders + Stats
    getRecentOrders: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/api/admin/reports/admin-dashboard",
        method: "GET",
        params: { startDate, endDate },
      }),
      transformResponse: (res) => {
        // Backend se recentOrders + totals dono mil rahe hain
        return {
          recentOrders: res?.data?.recentOrders || [],
          totals: res?.data?.totals || {},
          monthwiseOrderSummary: res?.data?.monthwiseOrderSummary || [],
        };
      },
    }),

    
    exportReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/admin/reports/export`,
        method: "GET",
        params: { startDate, endDate },
      }),
    }),

  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTopProductsQuery,
  useGetRecentOrdersQuery,
  useLazyExportReportQuery,
} = dashboardApi;