import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getAbstractStepGuide = createAsyncThunk(
  'submission/getAbstractStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAbstractStepGuide');
  }
);

export const getAbstractStepData = createAsyncThunk(
  'submission/getAbstractStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAbstractStepData');
  }
);

export const updateAbstractStepData = createAsyncThunk(
  'submission/updateAbstractStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.abstractSlice.value;
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
        throw new Error('Failed to update abstract step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getAbstractStepData
      const cacheKey = 'getAbstractStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);