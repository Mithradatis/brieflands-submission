import { submissionApi } from '@/app/services/apiSlice'

export const keywordsApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    findKeywords: build.query({
      query: ( queryString: string ) => queryString,
      transformResponse: ( response: { data: object[] } ) => response.data,
      providesTags: ['SearchedKeywords']
    }),
    getKeywords: build.query({
      query: ( url: string ) => `${ url }`,
      transformResponse: ( response: { data: object } ) =>  response.data,
      providesTags: ['Keywords']
    }),
    getKeywordsList: build.query({
      query: ( url: string ) => `${ url }`,
      transformResponse: ( response: { data: object } ) => response.data,
      providesTags: ['KeywordsList']
    }),
    addNewKeyword: build.mutation({
      query: ({ url, data }: { url: string, data: any }) => ({
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( data ),
      }),
      invalidatesTags: ['KeywordsList']
    }),
  })
})

export const { 
  useLazyFindKeywordsQuery,
  useLazyGetKeywordsQuery,
  useGetKeywordsListQuery, 
  useAddNewKeywordMutation 
} = keywordsApi

