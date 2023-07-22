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

export const getRegionStepGuide = createAsyncThunk(
  'submission/getRegionStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getRegions = createAsyncThunk(
  'submission/getRegions',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getRegionStepData = createAsyncThunk(
  'submission/getRegionStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);