import { submissionApi } from '@/app/services/apiSlice'

export const agreemrntApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getAgreementTerms: build.query({
      query: ( workflowId: string ) => `${ process.env.SUBMISSION_API_URL }/${ workflowId }/agreement/current`,
      transformResponse: ( response: { data: object } ) => response.data
    })
  })
})

export const { useGetAgreementTermsQuery } = agreemrntApi

