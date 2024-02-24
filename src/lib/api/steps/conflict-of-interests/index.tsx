import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getConflictOfInterestsStepGuide = createAsyncThunk(
  'submission/getConflictOfInterestsStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getConflictOfInterestsStepGuide');
  }
);

export const getConflictOfInterestsStepData = createAsyncThunk(
  'submission/getConflictOfInterestsStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getConflictOfInterestsStepData');
  }
);

export const updateConflictOfInterestsStepData = createAsyncThunk(
  'submission/updateConflictOfInterestsStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.footnotesSlice.value?.conflict_of_interests;
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
        throw new Error('Failed to update conflict of interests step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getConflictOfInterestsStepData
      const cacheKey = 'getConflictOfInterestsStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);