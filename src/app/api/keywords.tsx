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

export const updateKeywordsStepData = createAsyncThunk(
  'submission/updateKeywordsStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.keywordsSlice.value;
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
        throw new Error('Failed to update keywords step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);