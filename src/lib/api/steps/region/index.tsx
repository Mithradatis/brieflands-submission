import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getRegionStepGuide = createAsyncThunk(
  'submission/getRegionStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getRegionStepGuide');
  }
);

export const getRegions = createAsyncThunk(
  'submission/getRegions',
  async (url: string) => {
    return fetchDataFromApi(url, 'getRegions');
  }
);

export const getRegionStepData = createAsyncThunk(
  'submission/getRegionStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getRegionStepData');
  }
);

export const updateRegionStepData = createAsyncThunk(
  'submission/updateRegionStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.regionSlice.value;
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
        throw new Error('Failed to update region step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getRegionStepData
      const cacheKey = 'getRegionStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);