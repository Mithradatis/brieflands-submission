import { submissionApi } from '@/app/services/apiSlice'

export const buildApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getFinalAgreementGuide: build.query({
      query: ( url: string ) => url,
      transformResponse: ( response: { data: object } ) => response.data
    })
  })
})

export const { useLazyGetFinalAgreementGuideQuery } = buildApi