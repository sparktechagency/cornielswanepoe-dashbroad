// src/redux/api/stockApi.ts

import { baseApi } from "../../base/baseAPI";

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPendingRequests: builder.query({
            query: () => "/requests/pending",
            providesTags: ["stock"],
        }),
        getSingleRequests: builder.query({
            query: (id) => `/requests/single/${id}`,
            providesTags: ["stock"],
            transformResponse: (response: { data: any }) => response.data,
        }),
        requestApproval: builder.mutation({
            query: (data) => ({
                url: `/requests/approve/${data.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["stock"],
        }),
        
    }),
});

export const { useGetPendingRequestsQuery, useGetSingleRequestsQuery, useRequestApprovalMutation } = stockApi;