// src/redux/api/stockApi.ts

import { baseApi } from "../../base/baseAPI";

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRequests: builder.query({
            query: () => "/requests",
            providesTags: ["request"],
        }),
        getPendingRequests: builder.query({
            query: () => "/requests/pending",
            providesTags: ["request"],
        }),
        getSingleRequests: builder.query({
            query: (id) => `/requests/single/${id}`,
            providesTags: ["request"],
            transformResponse: (response: { data: any }) => response.data,
        }),
        requestApproval: builder.mutation({
            query: (data) => ({
                url: `/requests/approve/${data.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["request"],
        }),
        
    }),
});

export const { useGetRequestsQuery, useGetPendingRequestsQuery, useGetSingleRequestsQuery, useRequestApprovalMutation } = stockApi;