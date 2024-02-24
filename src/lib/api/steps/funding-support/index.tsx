import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getFundingSupportStepGuide = createAsyncThunk(
  'submission/getFundingSupportStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getFundingSupportStepGuide');
  }
);

export const getFundingSupportStepData = createAsyncThunk(
  'submission/getFundingSupportStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getFundingSupportStepData');
  }
);

export const updateFundingSupportStepData = createAsyncThunk(
  'submission/updateFundingSupportStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.footnotesSlice.value?.funding_support;
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
        throw new Error('Failed to update funding/support step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getFundingSupportStepData
      const cacheKey = 'getFundingSupportStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);