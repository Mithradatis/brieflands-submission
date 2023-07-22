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

export const getBuildStepGuide = createAsyncThunk(
  'submission/getBuildStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getBuildStepData = createAsyncThunk(
  'submission/getBuildStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);