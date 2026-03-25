// src/services/ticketsApi.js
import { apiSlice } from "./apiSlice";

export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Tickets
    getAllTickets: builder.query({
      query: () => "/api/admin/tickets/get-all",
      providesTags: ["Tickets"],
    }),

    // Update Ticket Status
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/api/admin/tickets/update-status/${ticketId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useUpdateTicketStatusMutation,
} = ticketsApi;