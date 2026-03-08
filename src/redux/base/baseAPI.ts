// import { createApi } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({

    baseUrl: "https://rakibur5000.binarybards.online/api/v1",   
    // baseUrl: "http://10.10.7.48:5000/api/v1",   
    prepareHeaders: (headers) => {      
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",

  }),
  endpoints: () => ({}),
  tagTypes: ["user", "notifications", "admin", "category", "slider", "faqs", "withdrawal", "planner", "stock", "request", "cms"],
});

export const imageUrl = "https://rakibur5000.binarybards.online";
// export const imageUrl = "http://10.10.7.48:5000";