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

export const getTypesStepGuide = createAsyncThunk(
  'submission/getTypesStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getDocumentTypes = createAsyncThunk(
  'submission/getDocumentTypes',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getTypesStepData = createAsyncThunk(
  'submission/getTypesStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const updateTypesStepData = createAsyncThunk(
  'submission/updateTypesStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.documentTypesSlice.value;
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
        throw new Error('Failed to update types step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);