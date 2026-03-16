import { baseApi } from "../../base/baseAPI";


const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all feedbacks
    getFeedbacks: builder.query({
      query: (params) => ({
        url: "/feedback",
        method: "GET",
        params,
      }),
      providesTags: ["Feedback"],
    }),

    // DELETE a feedback
    deleteFeedback: builder.mutation({
      query: (id: string) => ({
        url: `/feedback/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feedback"],
    }),

    // PATCH toggle active/inactive
    toggleFeedbackStatus: builder.mutation({
      query: (data) => ({
        url: `/feedback/update/status/${data?.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useDeleteFeedbackMutation,
  useToggleFeedbackStatusMutation,
} = feedbackApi;

export default feedbackApi;