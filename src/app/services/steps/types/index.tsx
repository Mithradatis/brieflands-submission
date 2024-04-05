import { submissionApi } from '@/app/services/apiSlice'

export const typesApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getTypes: build.query({
      query: ( url: string ) => `${ process.env.API_URL }/${ url }`,
      transformResponse: ( response: { data: object } ) => response.data,
      invalidates: ['StepData', 'SubmissionSteps', 'Workflow']
    })
  })
})

export const { useGetTypesQuery } = typesApi

