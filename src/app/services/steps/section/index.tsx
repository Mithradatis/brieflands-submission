import { submissionApi } from '@/app/services/apiSlice'

export const sectionApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getSections: build.query({
      query: ( url: string ) => `${ process.env.API_URL }/${ url }`,
      transformResponse: ( response: { data: object } ) => response.data,
      invalidates: ['StepData', 'SubmissionSteps', 'Workflow']
    })
  })
})

export const { useGetSectionsQuery } = sectionApi