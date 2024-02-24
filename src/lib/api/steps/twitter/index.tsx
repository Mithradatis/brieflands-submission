import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getTwitterStepGuide = createAsyncThunk(
  'submission/getTwitterStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getTwitterStepGuide');
  }
);

export const getTwitterStepData = createAsyncThunk(
  'submission/getTwitterStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getTwitterStepData');
  }
);

export const updateTwitterStepData = createAsyncThunk(
  'submission/updateTwitterStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.twitterSlice.value;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update twitter step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getTwitterStepData
      const cacheKey = 'getTwitterStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);