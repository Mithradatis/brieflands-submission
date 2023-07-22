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

export const getKeywordsStepGuide = createAsyncThunk(
  'submission/getKeywordsStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getKeywordsList = createAsyncThunk(
  'submission/getKeywordsList',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getKeywordsStepData = createAsyncThunk(
  'submission/getKeywordsStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);