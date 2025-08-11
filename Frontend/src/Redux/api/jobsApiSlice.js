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
            invalidatesTags:['Job']
        }),
        update:builder.mutation({
            query:({id,data})=>({
                url:`${JOBS_URL}/${id}`,
                method:'PUT',
                body:data,
                headers:{
                'Content-Type':'application/json',
                },
            }),
        }),
        delete:builder.mutation({
            query:(id)=>({
                url:`${JOBS_URL}/${id}`,
                method:'DELETE'
            })
        }),
        getByStatus:builder.query({
            query:()=>({
                url:`${JOBS_URL}/stats/status`,
                method:'GET'
            })
        }),
        getByMonth:builder.query({
            query:()=>({
                url:`${JOBS_URL}/stats/month`,
                method:'GET'
            })
        }),
        getAllJobs:builder.query({
           query:()=>({
              url:`${JOBS_URL}/getalljobs`,
              method:'GET'
           }) 
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