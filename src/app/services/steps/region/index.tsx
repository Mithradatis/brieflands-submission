import { submissionApi } from '@/app/services/apiSlice'

export const regionApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getRegions: build.query({
      query: () => 'journal/region',
      transformResponse: ( response: { data: object } ) => response.data,
      invalidates: ['StepData', 'SubmissionSteps', 'Workflow']
    })
  })
})

export const { useGetRegionsQuery } = regionApi