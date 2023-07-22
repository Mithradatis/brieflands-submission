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