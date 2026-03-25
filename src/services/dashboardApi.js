// src/services/dashboardApi.js
import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Dashboard Stats
    getDashboardStats: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/admin/reports/admin-dashboard`,
        method: "GET",
        params: { startDate, endDate },
      }),
      transformResponse: (res) => res?.data || res,
      providesTags: ["Dashboard"],
    }),

    // Top Products
    getTopProducts: builder.query({
      query: () => ({
        url: `/api/admin/reports/top-products`,
        method: "GET",
      }),
      transformResponse: (res) => {
        if (res?.topProducts) return res.topProducts;
        if (res?.data?.topProducts) return res.data.topProducts;
        if (res?.data) return res.data;
        return Array.isArray(res) ? res : [];
      },
    }),

    // Recent Orders + Stats
    getRecentOrders: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/api/admin/reports/admin-dashboard",
        method: "GET",
        params: { startDate, endDate },
      }),
      transformResponse: (res) => ({
        recentOrders: res?.data?.recentOrders || [],
        totals: res?.data?.totals || {},
        monthwiseOrderSummary: res?.data?.monthwiseOrderSummary || [],
      }),
    }),

    // ✅ FIXED Export Report (Critical Fix)
    exportReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/admin/reports/export`,
        method: "GET",
        params: { startDate, endDate },
        responseHandler: (response) => response.blob(),   
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