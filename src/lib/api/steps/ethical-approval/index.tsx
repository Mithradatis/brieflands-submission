import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getEthicalApprovalStepGuide = createAsyncThunk(
  'submission/getEthicalApprovalStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getEthicalApprovalStepGuide');
  }
);

export const getEthicalApprovalStepData = createAsyncThunk(
  'submission/getEthicalApprovalStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getEthicalApprovalStepData');
  }
);

export const updateEthicalApprovalStepData = createAsyncThunk(
  'submission/updateEthicalApprovalStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.ethicalStatementsSlice.value?.ethical_approval;
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
        throw new Error('Failed to update ethical approval step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getEthicalApprovalStepData
      const cacheKey = 'getEthicalApprovalStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);