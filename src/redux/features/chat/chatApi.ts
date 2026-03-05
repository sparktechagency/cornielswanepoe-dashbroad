import { baseApi } from "../../base/baseAPI";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({
                url: `/chats${location?.search}`,
            }),
            transformResponse: (res: { data: any }) => res?.data,
        }),

        getRequestChatById: builder.query({
            query: (id) => `/chat/admin?postId=${id}`,
            transformResponse: (res: { data: any }) => res?.data,
        }),

        createChat: builder.mutation({
            query: (body) => ({
                url: "/chats",
                method: "POST",
                body,
            }),
        }),

        updateChat: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/chats/${id}`,
                method: "PUT",
                body,
            }),
        }),

        deleteChat: builder.mutation({
            query: (id) => ({
                url: `/chats/${id}`,
                method: "DELETE",
            }),
        }),

        sendMessage: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/messages/${id}/messages`,
                method: "POST",
                body,
            }),
        }),
        blockConversation: builder.mutation({
            query: (id) => ({
                url: `/chat/admin/${id}/block`,
                method: "PATCH",                
            }),
        }),

        getMessages: builder.query({
            query: (id) => `/messages/admin/${id}`,
            transformResponse: (res: { data: any }) => res?.data,
        }),

        getChatAnalytics: builder.query({
            query: (id) => `/chats/${id}/analytics`,
            transformResponse: (res: { data: any }) => res?.data,
        }),

        getChatGrowth: builder.query({
            query: () => `/analytics/admin-chat-growth-chart${location?.search}`,
            transformResponse: (res: { data: any }) => res?.data,
        }),
    }),
});

export const {
    useGetChatsQuery,
    useGetRequestChatByIdQuery,
    useCreateChatMutation,
    useUpdateChatMutation,
    useDeleteChatMutation,
    useSendMessageMutation,
    useBlockConversationMutation,
    useGetMessagesQuery,
    useGetChatAnalyticsQuery,
    useGetChatGrowthQuery,
} = chatApi;