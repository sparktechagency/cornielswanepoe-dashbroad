// src/redux/api/stockApi.ts

import { baseApi } from "../../base/baseAPI";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingStocks: builder.query<any, void>({
      query: () => "/stocks/pending",
      providesTags: ["stock"],
    }),
  }),
});

export const { useGetPendingStocksQuery } = stockApi;