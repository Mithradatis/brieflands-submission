import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi } from '@api/client'

export const getAgreementTerms = createAsyncThunk(
  'submission/getAgreementTerms',
  async ( url: string ) => {
   return await fetchDataFromApi( url );
  }
);

