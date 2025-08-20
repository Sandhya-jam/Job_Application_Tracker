import {fetchBaseQuery,createApi} from '@reduxjs/toolkit/query/react'

import { BASE_URL } from '../constants'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfoJ?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice=createApi({
    baseQuery,
    tagTypes:['Profile','Job','JobStats','JobMonths','Users','Analytics'],
    endpoints:()=>({}),
})
