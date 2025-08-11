import { apiSlice } from "./apiSlice";
import { JOBS_URL } from "../constants";

export const jobsApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        create:builder.mutation({
            query:(data)=>({
                url:`${JOBS_URL}`,
                method:'POST',
                body:data,
            }),
            invalidatesTags:['Job','JobStats','JobMonths']
        }),
        update:builder.mutation({
            query:({id,data})=>({
                url:`${JOBS_URL}/${id}`,
                method:'PUT',
                body:data,
                headers:{
                'Content-Type':'application/json',
                },
                invalidatesTags:['Job','JobStats','JobMonths'],
            }),
        }),
        delete:builder.mutation({
            query:(id)=>({
                url:`${JOBS_URL}/${id}`,
                method:'DELETE'
            }),
            invalidatesTags:['Job','JobStats','JobMonths'],
        }),
        getByStatus:builder.query({
            query:()=>({
                url:`${JOBS_URL}/stats/status`,
                method:'GET',
            }),
            providesTags:['JobStats'],
        }),
        getByMonth:builder.query({
            query:()=>({
                url:`${JOBS_URL}/stats/month`,
                method:'GET'
            }),
            providesTags:['JobMonths']
        }),
        getAllJobs:builder.query({
           query:()=>({
              url:`${JOBS_URL}/getalljobs`,
              method:'GET'
           }),
           providesTags:['Job','JobStats','JobMonths'] 
        })
    })
});

export const{
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
    useGetByMonthQuery,
    useGetByStatusQuery,
    useGetAllJobsQuery
}=jobsApiSlice