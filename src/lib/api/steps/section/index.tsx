import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi } from '@api/client'

export const getSections = createAsyncThunk(
  'submission/getSections',
  async ( url: string ) => {
    return fetchDataFromApi( url );
  }
);