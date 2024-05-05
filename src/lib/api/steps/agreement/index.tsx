import { createAsyncThunk } from '@reduxjs/toolkit'

export const getAgreementTerms = createAsyncThunk(
  'submission/getAgreementTerms',
  async ( url: string ) => {
  //  return await fetchDataFromApi( url );
  }
);

