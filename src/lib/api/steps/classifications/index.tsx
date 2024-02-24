import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getClassificationsStepGuide = createAsyncThunk(
  'submission/getClassificationsStepGuide',
  async (url: string) => {
    return fetchDataFromApi( url, 'getClassificationsStepGuide');
  }
);

export const getClassificationsStepData = createAsyncThunk(
  'submission/getClassificationsStepData',
  async (url: string) => {
    return fetchDataFromApi( url, 'getClassificationsStepData');
  }
);

export const getClassificationsList = createAsyncThunk(
    'submission/getClassifications',
    async (url: string) => {
      return fetchDataFromApi( url, 'getClassifications');
    }
);

export const updateClassificationsStepData = createAsyncThunk(
  'submission/updateClassificationsStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.classificationsSlice.value;
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
        throw new Error('Failed to update classifications step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getClassificationsStepData
      const cacheKey = 'getClassificationsStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);