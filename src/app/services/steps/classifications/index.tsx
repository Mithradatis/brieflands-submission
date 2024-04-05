import { submissionApi } from '@/app/services/apiSlice'

export const classificationsApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getClassifications: build.query({
      query: () => 'journal/classification',
      transformResponse: ( response: { data: object } ) => response.data
    })
  })
})

export const { useGetClassificationsQuery } = classificationsApi

