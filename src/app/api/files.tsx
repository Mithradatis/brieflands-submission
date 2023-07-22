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

export const getFilesStepGuide = createAsyncThunk(
  'submission/getFilesStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getDocumentFiles = createAsyncThunk(
  'submission/getDocumentFiles',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getFilesStepData = createAsyncThunk(
  'submission/getFilesStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);