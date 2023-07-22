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

export const getAbstractStepGuide = createAsyncThunk(
  'submission/getAbstractStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getAbstractStepData = createAsyncThunk(
  'submission/getAbstractStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);