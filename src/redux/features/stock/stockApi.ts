// src/redux/api/stockApi.ts

import { baseApi } from "../../base/baseAPI";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetPendingStocksQuery, useGetSingleStocksQuery, useStockApprovalMutation } = stockApi;