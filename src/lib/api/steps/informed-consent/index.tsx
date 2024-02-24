import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getInformedConsentStepGuide = createAsyncThunk(
  'submission/getInformedConsentStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getInformedConsentStepGuide');
  }
);

export const getInformedConsentStepData = createAsyncThunk(
  'submission/getInformedConsentStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getInformedConsentStepData');
  }
);

export const updateInformedConsentStepData = createAsyncThunk(
  'submission/updateInformedConsentStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.ethicalStatementsSlice.value?.informed_consent;
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
        throw new Error('Failed to update informed consent step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getInformedConsentStepData
      const cacheKey = 'getInformedConsentStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);