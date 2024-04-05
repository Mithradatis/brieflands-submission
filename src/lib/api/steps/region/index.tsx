import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi } from '@api/client'

export const getRegions = createAsyncThunk(
  'submission/getRegions',
  async ( url: string ) => {
    return fetchDataFromApi( url );
  }
);