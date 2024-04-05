import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { error } from 'console';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
  credentials: 'include',
  redirect: 'follow'
});

const baseQueryWithRetry = retry( baseQuery, { maxRetries: 0 } );

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
export const submissionApi: any = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: 'submissionApi',
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: baseQueryWithRetry,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: [
    'Countries',
    'Workflow', 
    'User', 
    'Journal',
    'Keywords',
    'KeywordsList',
    'SameArticles',
    'SameArticlesGuide',
    'SearchedKeywords', 
    'StepData', 
    'StepGuide', 
    'SubmissionSteps'
  ],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({}),
});

export const enhancedApi = submissionApi.injectEndpoints({
  endpoints: ( builder: any ) => ({
    buildNewWorkflow: builder.mutation({
      query: ( url: string ) => ({
        url: `${process.env.SUBMISSION_API_URL}/${url}`,
        method: 'POST'
      })
    }),
    getCountries: builder.query({
      query: ( url: string ) => `${process.env.API_URL}/${url}`,
      transformResponse: ( response: { data: object[] } ) => response.data
    }),
    getJournal: builder.query({
      query: ( workflowId: string ) => workflowId,
      transformResponse: ( 
        response: { data: { id: number, attributes: object } } 
      ) => response.data
    }),
    getSameArticles: builder.query({
      query: ( { url, documentDetails }: { url: string, documentDetails: object } ) => ({
        url: `${process.env.SUBMISSION_API_URL}/${url}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( documentDetails ),
      }),
      transformResponse: ( response: any ) => response.data.same_articles 
    }),
    getSameArticlesGuide: builder.query({
      query: ( url: string ) => url,
      transformResponse: ( response: any ) => response.data.value  
    }),
    getScreening: builder.query({
      query: ( workflowId: string ) => `${process.env.SUBMISSION_API_URL}/${workflowId}`,
      transformResponse: ( 
        response: { data: { id: number, attributes: object } }
      ) => response.data,
    }),
    getStepData: builder.query({
      query: ( url: string ) => `${process.env.SUBMISSION_API_URL}/${url}`,
      refetchOnMountOrArgChange: true,
      transformResponse: ( response: { data: { step_data: object } } ) => response.data.step_data,
      providesTags: ['StepData']
    }),
    getStepGuide: builder.query({
      query: ( url: string ) => `${url}`,
      transformResponse: ( response: { data: { value: object | string } } ) => response.data.value
    }),
    getSubmissionSteps: builder.query({
      query: ( url: string ) => `${process.env.SUBMISSION_API_URL}/${url}`,
      transformResponse: ( 
        response: { data: { id: number, attributes: object } } 
      ) => response.data
    }),
    getUser: builder.query({
      query: ( workflowId: string ) => workflowId,
      transformResponse: ( 
        response: { data: { id: number, attributes: object } } 
      ) => response.data
    }),
    getWorkflow: builder.query({
      query: ( workflowId: string ) => `${process.env.SUBMISSION_API_URL}/${workflowId}`,
      transformResponse: ( 
        response: { data: { id: number, attributes: object } }
      ) => response.data
    }),
    updateStepData: builder.mutation({
      query: ({ url, data }: { url: string, data: any }) => ({
        url: `${process.env.SUBMISSION_API_URL}/${url}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( data ),
      }),
      invalidatesTags: ['StepData'],
    }),
  })
});

export const { 
  useBuildNewWorkflowMutation,
  useGetCountriesQuery,
  useGetScreeningQuery,
  useGetStepDataQuery, 
  useGetStepGuideQuery,
  useGetWorkflowQuery,
  useLazyGetJournalQuery,
  useLazyGetSameArticlesQuery,
  useLazyGetSameArticlesGuideQuery,
  useLazyGetSubmissionStepsQuery,
  useLazyGetUserQuery,
  useLazyGetWorkflowQuery,
  useUpdateStepDataMutation
} = submissionApi;


