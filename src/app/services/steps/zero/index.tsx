import { createAsyncThunk } from '@reduxjs/toolkit'

export const getZeroStepGuide = createAsyncThunk(
  'submission/getZeroStepGuide',
  async (url: string) => {
    // return fetchDataFromApi(url, 'getZeroStepGuide');
  }
);

export const getZeroStepData = createAsyncThunk(
  'submission/getZeroStepData',
  async (url: string) => {
    // return fetchDataFromApi(url, 'getZeroStepData');
  }
);
