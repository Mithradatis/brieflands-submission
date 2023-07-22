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

export const getEditorStepGuide = createAsyncThunk(
  'submission/getEditorStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getEditors = createAsyncThunk(
  'submission/getEditors',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getEditorStepData = createAsyncThunk(
  'submission/getEditorStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);