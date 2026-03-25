// src/services/membershipApi.js
import { apiSlice } from "./apiSlice";

export const membershipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // 4. Get All Plans
    getAllPlans: builder.query({
      query: () => "/api/admin/plans",
      providesTags: ["Plans"],
    }),

    // 5. Get Single Plan
    getPlanById: builder.query({
      query: (id) => `/api/admin/plan/${id}`,
      providesTags: (result, error, id) => [{ type: "Plans", id }],
    }),

    // 1. Create Plan
    createPlan: builder.mutation({
      query: (planData) => ({
        url: "/api/admin/admin/plans",
        method: "POST",
        body: planData,
      }),
      invalidatesTags: ["Plans"],
    }),

    // 2. Update Plan (partial update supported)
    updatePlan: builder.mutation({
      query: ({ id, ...planData }) => ({
        url: `/api/admin/admin/plans/${id}`,
        method: "PUT",
        body: planData,
      }),
      invalidatesTags: (result, error, { id }) => ["Plans", { type: "Plans", id }],
    }),

    // 3. Delete Plan
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `/api/admin/admin/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),

  }),
});

export const {
  useGetAllPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = membershipApi;