import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getClinicalTrialRegistrationCodeStepGuide = createAsyncThunk(
  'submission/getClinicalTrialRegistrationCodeStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getClinicalTrialRegistrationCodeStepGuide');
  }
);

export const getClinicalTrialRegistrationCodeStepData = createAsyncThunk(
  'submission/getClinicalTrialRegistrationCodeStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getClinicalTrialRegistrationCodeStepData');
  }
);

export const updateClinicalTrialRegistrationCodeStepData = createAsyncThunk(
  'submission/updateClinicalTrialRegistrationCodeStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.ethicalStatementsSlice.value?.clinical_trial_registration_code;
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
        throw new Error('Failed to update clinical trial registration code step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getClinicalTrialRegistrationCodeStepData
      const cacheKey = 'getClinicalTrialRegistrationCodeStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);