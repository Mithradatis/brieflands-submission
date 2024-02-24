import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getAuthorContributionStepGuide = createAsyncThunk(
  'submission/getAuthorContributionStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAuthorContributionStepGuide');
  }
);

export const getAuthorContributionStepData = createAsyncThunk(
  'submission/getAuthorContributionStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAuthorContributionStepData');
  }
);

export const updateAuthorContributionStepData = createAsyncThunk(
  'submission/updateAuthorContributionStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.footnotesSlice.value?.authors_contribution;
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
        throw new Error('Failed to update author contribution step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getAuthorContributionStepData
      const cacheKey = 'getAuthorContributionStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);