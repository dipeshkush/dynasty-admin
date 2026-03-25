import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: "/api/admin/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // GET PROFILE
    getProfile: builder.query({
      query: () => "/api/admin/profile",
    }),

    // UPDATE PROFILE
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/api/admin/profile/update",
        method: "PUT",
        body: data,
      }),
    }),

    // CHANGE PASSWORD
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/api/admin/profile/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    // ADMIN MANAGEMENT ENDPOINTS – WITH PROPER TAGGING

    // Create Admin
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/api/admin/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admins"],          
    }),

    // Get All Admins
    getAdmins: builder.query({
      query: () => "/api/admin/get-admins",
      providesTags: ["Admins"],             
    }),

    // Update Admin
    updateAdmin: builder.mutation({
      query: ({ id, ...body }) => ({        
        url: `/api/admin/update-admin/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admins"],       
    }),

    // Delete Admin
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/api/admin/delete-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],          
    }),

  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useCreateAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = authApi;