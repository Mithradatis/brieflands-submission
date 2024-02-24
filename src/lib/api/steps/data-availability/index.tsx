import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getDataAvailabilityStepGuide = createAsyncThunk(
  'submission/getDataAvailabilityStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getDataAvailabilityStepGuide');
  }
);

export const getDataAvailabilityStepData = createAsyncThunk(
  'submission/getDataAvailabilityStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getDataAvailabilityStepData');
  }
);

export const updateDataAvailabilityStepData = createAsyncThunk(
  'submission/updateDataAvailabilityStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.ethicalStatementsSlice.value?.data_availability;
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
        throw new Error('Failed to update data availability step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getDataAvailabilityStepData
      const cacheKey = 'getDataAvailabilityStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);