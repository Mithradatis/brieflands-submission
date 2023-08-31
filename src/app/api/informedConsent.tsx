import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchDataFromApi = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      redirect: 'follow',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getInformedConsentStepGuide = createAsyncThunk(
  'submission/getInformedConsentStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getInformedConsentStepData = createAsyncThunk(
  'submission/getInformedConsentStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const updateInformedConsentStepData = createAsyncThunk(
  'submission/updateInformedConsentStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.permissionsSlice.value.informedConsent;
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

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);