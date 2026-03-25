// src/services/supportApi.js
import { apiSlice } from "./apiSlice";

export const supportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendSupportMail: builder.mutation({
      query: (formData) => ({
        url: "/api/admin/send-support-mail",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSendSupportMailMutation } = supportApi;