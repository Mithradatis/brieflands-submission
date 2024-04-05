import { submissionApi } from '@/app/services/apiSlice'

export const editorApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getEditors: build.query({
      query: ( url: string ) => url,
      transformResponse: ( response: { data: object } ) => response.data
    })
  })
})

export const { useGetEditorsQuery } = editorApi