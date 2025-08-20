import { apiSlice } from "./apiSlice";
import { ADMIN_URL } from "../constants";

export const adminApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getUsers:builder.query({
            query:({page=1,limit=20,search=""})=>({
                url:`${ADMIN_URL}/users?page=${page}&limit=${limit}&search=${search}`,
                method:'GET',
            }),
            providesTags:["Users"],
        }),
        updateUser:builder.mutation({
            query:({id,body})=>({
                url:`${ADMIN_URL}/users/${id}`,
                method:'PUT',
                body:body
            }),
            invalidatesTags:["Users"],
        }),
        deleteUser:builder.mutation({
            query:(id)=>({
                url:`${ADMIN_URL}/users/${id}`,
                method:'DELETE'
            }),
            invalidatesTags:["Users"]
        }),
        //JObs
        getJobs: builder.query({
            query: ({ page = 1, limit = 20, search = "", filters = {} }) => ({
                url: `${ADMIN_URL}/jobs?page=${page}&limit=${limit}`,
                method: "POST",
                body: { search, ...filters },
            }),
            providesTags: ["Job"],
        }),

        deleteJob:builder.mutation({
            query:(id)=>({
                url:`${ADMIN_URL}/jobs/${id}`,
                method:'DELETE',
            }),
            invalidatesTags:["Job"]
        }),

        //analytics
        getStats:builder.query({
            query:()=>`${ADMIN_URL}/analytics/stats`
        }),
        getJobsByMonth:builder.query({
            query:()=>`${ADMIN_URL}/analytics/jobs-by-month`
        }),
        getConversion:builder.query({
            query:()=>`${ADMIN_URL}/analytics/conversions`
        }),
        getAvgDays:builder.query({
            query:()=>`${ADMIN_URL}/analytics/avg-days`
        }),
    })
});

export const{
useGetUsersQuery,
useUpdateUserMutation,
useDeleteUserMutation,
useGetJobsQuery,
useDeleteJobMutation,
useGetStatsQuery,
useGetJobsByMonthQuery,
useGetConversionQuery,
useGetAvgDaysQuery
}=adminApiSlice;