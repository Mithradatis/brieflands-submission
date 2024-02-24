import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getCommentsStepGuide = createAsyncThunk(
  'submission/getCommentsStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getCommentsStepGuide');
  }
);

export const getCommentsStepData = createAsyncThunk(
  'submission/getCommentsStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getCommentsStepData');
  }
);

export const updateCommentsStepData = createAsyncThunk(
  'submission/updateCommentsStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.commentsSlice.value;
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
        throw new Error('Failed to update comments step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getCommentsStepData
      const cacheKey = 'getCommentsStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);