import { submissionApi } from '@/app/services/apiSlice'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Author } from '@/app/services/types/author'

export const authorApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    deleteAuthor: build.mutation({
      query: ( { url, authorEmail }: { url: string, authorEmail: string } ) => ({
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: authorEmail }),
      }),
      invalidatesTags: ['StepData', 'Affiliations']
    }),
    getAuthorsAffiliations: build.query({
      query: ( workflowId: string ) => `${ process.env.SUBMISSION_API_URL }/${ workflowId }/authors/affiliations`,
      transformResponse: ( response: { data: { affiliations: object[] } } ) => response.data.affiliations,
      providesTags: ['Affiliations']
    }),
    handleAuthorOperation: build.mutation({
      query: ( 
        { 
          workflowId, 
          action, 
          data 
        }: { 
          workflowId: string, 
          action: string, 
          data: Author 
        } 
      ) => ({
        url: `${ process.env.SUBMISSION_API_URL }/${ workflowId }/authors/${ action }`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": data.email,
          "first-name": data.firstName,
          "middle-name": data.middleName,
          "last-name": data.lastName,
          "orcid-id": data.orcId,
          "country": parseInt( data.country ),
          "phone_type": [data.phoneType],
          "country_phone": [data.countryPhone],
          "phone_number": [data.phoneNumber],
          "affiliations": data.affiliations,
          "is_corresponding": data.isCorresponding,
          "correspond_affiliation": data.correspondAffiliation
        })
      }),
      transformResponse: ( response: any ) => response.data,
      invalidatesTags: ['StepData', 'Affiliations']
    }),
    searchPeople: build.query({
      query: (  { workflowId, email }: { workflowId: string, email: string } ) => ({ 
        url: `${ process.env.SUBMISSION_API_URL }/${ workflowId }/authors/find`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( { email: email } ),
      }),
      transformResponse: ( response: { data: { affiliations: object[] } } ) => response.data
    }),
    updateAuthorsOrder: build.mutation({
      query: ( { workflowId, data }: { workflowId: string, data: object } ) => ({
        url: `${ process.env.SUBMISSION_API_URL }/${ workflowId }/authors/change_order`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ),
      }),
      invalidatesTags: ['StepData', 'Affiliations']
    }),
  })
})

export const {
  useHandleAuthorOperationMutation,
  useGetAuthorsAffiliationsQuery,
  useDeleteAuthorMutation,
  useLazySearchPeopleQuery,
  useUpdateAuthorsOrderMutation
} = authorApi

export const updateAuthorsOrder = createAsyncThunk(
  'submission/updateAuthorsOrder',
  async ( payload: any, { getState } ) => {
    try {
      const state: any = getState();
      const stepData = state.authorsSlice.value;
      const { url, authors } = payload;
      const reorderedAuthors: any = [];
      authors.forEach((author: any) => {
        Object.entries(stepData).forEach(([key, value]) => {
          const authorItem: any = value;
          if ( authorItem.email === author.email ) {
            reorderedAuthors.push( key );
          }
        });
      });
      const data = {
        "ids": reorderedAuthors
      };
      const response = await fetch( url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update authors order');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      throw error;
    }
  }
);

export const createAuthorsTable = ( authors: any ) => {
  const authorsList = [];
  const keys = Object.keys(authors);
  if ( keys.length ) {
    for (let index = 0; index < keys.length; index++) {
      const key: any = keys[index];
      const value: any = authors[key];
      authorsList.push(
        {
          id: ( index + 1 ),
          email: value['email'],
          firstname: value['first-name'] || value['first_name'] || '',
          lastname: value['last-name'] || value['last_name'] || '',
          orcid: value['orcid-id'] || '',
          iscorresponding: value['is_corresponding'] ? 'Yes' : 'No'
        }
      );
      const authorItem: any = {};
      ( value['email'] !== null && ( authorItem['email'] = value['email'] ) );
      ( value['first_name'] !== null && ( authorItem['first-name'] = value['first-name'] ) );
      ( value['middle_name'] !== null && ( authorItem['middle-name'] = value['middle-name'] ) );
      ( value['last_name'] !== null && ( authorItem['last-name'] = value['last-name'] ) );
      ( value['orcid-id'] !== null && ( authorItem['orcid-id'] = value['orcid-id'] ) );
      ( value['country'] !== null && ( authorItem['country'] = value['country'] ) );
      ( value['phone_type'] && ( authorItem['phone_type'] = value['phone_type'] ) );
      ( value['country_phone'] && ( authorItem['country_phone'] = value['country_phone'] ) );
      ( value['phone_number'] && ( authorItem['phone_number'] = value['phone_number'] ) );
      ( value['affiliations'] !== null && ( authorItem['affiliations'] = value['affiliations'] ) );
      ( value['is_corresponding'] && ( authorItem['is_corresponding'] = value['is_corresponding'] ? 'on' : 'off') );
      ( value['correspond_affiliation'] && ( authorItem['correspond_affiliation'] = value['correspond_affiliation'] ) ); 
    }
  }

  return authorsList;
}