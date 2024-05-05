import { createAsyncThunk } from '@reduxjs/toolkit'

export const getSections = createAsyncThunk(
  'submission/getSections',
  async ( url: string ) => {
    // return fetchDataFromApi( url );
  }
);