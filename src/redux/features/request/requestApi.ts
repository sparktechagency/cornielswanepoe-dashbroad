// src/redux/api/stockApi.ts

import { baseApi } from "../../base/baseAPI";

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRequests: builder.query({
            query: () => "/requests",
            providesTags: ["request"],
        }),
        getMyRequests: builder.query({
            query: () => ({
                url: `/requests/my-listing${location.search}`,
                method: "GET",
            }),
            providesTags: ["request"],            
        }),
         updateRequest: builder.mutation({
            query: (data) => ({
                url: `/requests/update/${data?.id}`,
                method: "PATCH",
                body: data,               
            }),
            invalidatesTags: ["request"],
        }),
         createRequest: builder.mutation({
            query: (data) => ({
                url: "/requests/create",
                method: "POST",
                body: data,                
            }),
            invalidatesTags: ["request"],
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

export const { useGetRequestsQuery, useGetMyRequestsQuery, useUpdateRequestMutation, useCreateRequestMutation, useGetPendingRequestsQuery, useGetSingleRequestsQuery, useRequestApprovalMutation } = stockApi;