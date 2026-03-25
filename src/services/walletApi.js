// src/services/walletApi.js
import { apiSlice } from "./apiSlice";

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWallets: builder.query({
      query: ({ page = 1, limit = 40 } = {}) => 
        `/api/admin/wallets?limit=${limit}&page=${page}`,
      providesTags: ["Wallets"],
    }),

    getWalletByCustomerId: builder.query({
      query: (customerId) => `/api/admin/wallets/${customerId}`,
      providesTags: (result, error, customerId) => [
        { type: "Wallets", id: customerId },
      ],
    }),

    updateWalletBalance: builder.mutation({
      query: ({ customerId, ...body }) => ({
        url: `/api/admin/wallets/${customerId}/update-balance`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        "Wallets",
        { type: "Wallets", id: customerId },
      ],
    }),
  }),
});

export const {
  useGetAllWalletsQuery,
  useGetWalletByCustomerIdQuery,
  useUpdateWalletBalanceMutation,
} = walletApi;