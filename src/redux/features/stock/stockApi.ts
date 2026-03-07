// src/redux/api/stockApi.ts

import { baseApi } from "../../base/baseAPI";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query({
      query: () => ({
        url: `/stocks${location.search}`,
        method: "GET",
      }),
      providesTags: ["stock"],
    }),
    getMyStocks: builder.query({
      query: () => ({
        url: `/stocks/my-stocks${location.search}`,
        method: "GET",
      }),
      providesTags: ["stock"],
    }),
    createStock: builder.mutation({
      query: (data) => ({
        url: "/stocks/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["stock"],
    }),
    updateStock: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/stocks/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["stock"],
    }),

    getPendingStocks: builder.query({
      query: () => "/stocks/pending",
      providesTags: ["stock"],
    }),
    getSingleStocks: builder.query({
      query: (id) => `/stocks/single-stock/${id}`,
      providesTags: ["stock"],
      transformResponse: (response: { data: any }) => response.data,
    }),
    stockApproval: builder.mutation({
      query: (data) => ({
        url: `/stocks/approve/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["stock"],
    }),
    deleteStock: builder.mutation({
      query: (id: string) => ({
        url: `/stocks/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["stock"],
    }),
  }),
});

export const { useGetStocksQuery, useCreateStockMutation, useGetMyStocksQuery, useUpdateStockMutation, useDeleteStockMutation, useGetPendingStocksQuery, useGetSingleStocksQuery, useStockApprovalMutation } = stockApi;