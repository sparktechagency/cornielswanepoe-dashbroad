import { baseApi } from "../../base/baseAPI";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({      
      query: () =>`/user-managements/${location.search}`,
      providesTags: ['user'],      
    }),

    getSingleUser: build.query({      
      query: (id) =>`/user-managements/${id}`,
      providesTags: ['user'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    getProfile: build.query({
      query: ()=> `/users/profile`,
      transformResponse: (response: {data: any})=> response.data,
    }),

    // ------------ Admin -----------------
    createAdmin: build.mutation({
      query: (data)=>{
        return {
          url: "/admins/create-admin",
          method: "POST",
          body: data
        }
      },
      invalidatesTags: ['user', 'admin'],      
    }),
    
    getAdmin: build.query({
        query: ()=> `/admins/get-admin${location.search}`,
        providesTags: ['admin'],
        transformResponse: (response: {data: any})=> response.data,
    }),
    deleteAdmin: build.mutation({
        query: (id)=> {return {url: `/admins/${id}`, method: "DELETE"}},
        invalidatesTags: ['admin'],
        
    }),


    editProfile: build.mutation({
      query: (data)=>{
        return {
        url: '/users/profile',
        method: "PATCH",
        body: data,
        }
      }
    }),
    updateUser: build.mutation({
      query: (data)=>{        
        return {
          url: `/user-managements/status/${data?.id}`,
          method: "PATCH",
          body: data
        }        
      },
      invalidatesTags: ['user', 'admin'],      
    }),
    deleteUser: build.mutation({
      query: (id)=>{
        return {
          url: `/users/${id}`,
          method: "DELETE"
        }
      }
    }),
    getAllSubscriber: build.query({
      query: ()=>`/subscriptions${location?.search}`,
      transformResponse: (res: {data:any})=>res?.data
    })
  }),
});

export const { 
    useGetUsersQuery,
    useGetAdminQuery,
    useGetProfileQuery,
    useGetAllSubscriberQuery,

    useDeleteAdminMutation,
    useGetSingleUserQuery,
    useDeleteUserMutation,
    useEditProfileMutation,
    useCreateAdminMutation,
    useUpdateUserMutation,
 } = userApi;
