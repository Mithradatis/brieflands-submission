import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi } from '@api/client'

export const getClassificationsList = createAsyncThunk(
    'submission/getClassifications',
    async ( url: string ) => {
      return fetchDataFromApi( url );
    }
);