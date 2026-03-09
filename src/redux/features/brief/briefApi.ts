import { baseApi } from "../../base/baseAPI";

const briefApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBriefs: builder.query({
      query: () => ({
        url: `/briefs${location?.search}`,
      }),
        providesTags: ['brief'],
    }),

    getBriefById: builder.query({
      query: (id) => `/briefs/${id}`,
      transformResponse: (res: { data: any }) => res?.data,
    }),

    createBrief: builder.mutation({
      query: (body) => ({
        url: "/briefs/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ['brief'],
    }),

    updateBrief: builder.mutation({
      query: (data) => ({
        url: `/briefs/update/${data?.id}`,
        method: "PATCH",
        body: data?.payload,
      }),
      invalidatesTags: ['brief'],
    }),

    deleteBrief: builder.mutation({
      query: (id) => ({
        url: `/briefs/delete/${id}`,
        method: "DELETE",
      }),
        invalidatesTags: ['brief'],
    }),
  }),
});

export const {
  useGetBriefsQuery,
  useGetBriefByIdQuery,
  useCreateBriefMutation,
  useUpdateBriefMutation,
  useDeleteBriefMutation,
} = briefApi;