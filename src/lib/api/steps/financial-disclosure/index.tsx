import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getFinancialDisclosureStepGuide = createAsyncThunk(
  'submission/getFinancialDisclosureStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getFinancialDisclosureStepGuide');
  }
);

export const getFinancialDisclosureStepData = createAsyncThunk(
  'submission/getFinancialDisclosureStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getFinancialDisclosureStepData');
  }
);

export const updateFinancialDisclosureStepData = createAsyncThunk(
  'submission/updateFinancialDisclosureStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.financialDisclosureSlice.value;
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
        throw new Error('Failed to update financial disclosure step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getFinancialDisclosureStepData
      const cacheKey = 'getFinancialDisclosureStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);