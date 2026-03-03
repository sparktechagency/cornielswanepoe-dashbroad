import { baseApi } from "../../base/baseAPI";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: (year) => `/dashboard/stats-cards?year=${year}${location?.search}`,
            transformResponse: (res: { data: any }) => res?.data,
        }),
        getUsersGrowth: builder.query({
            query: (year) => `/dashboard/user-growth-trend?year=${year}`,
            transformResponse: (res: { data: any }) => res.data,
        }),
        getOverView: builder.query({
            query: () => `/analytics/overview${location?.search}`,
            transformResponse: (res: { data: any }) => res?.data
        }),
        getRevenueGrowth: builder.query({
            query: () => `/analytics/admin-campaign-revenue-analytics${location?.search}`,
            transformResponse: (res: { data: any }) => res?.data
        })
    })
})

export const {
    useGetAnalyticsQuery,
    useGetUsersGrowthQuery,
    useGetOverViewQuery,
    useGetRevenueGrowthQuery
} = dashboardApi;