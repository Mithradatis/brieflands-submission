import { createAsyncThunk } from '@reduxjs/toolkit'

export const getRegions = createAsyncThunk(
  'submission/getRegions',
  async ( url: string ) => {
    // return fetchDataFromApi( url );
  }
);