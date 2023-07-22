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

export const getAuthorStepGuide = createAsyncThunk(
  'submission/getAuthorStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getAuthors = createAsyncThunk(
  'submission/getAuthors',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getAuthorStepData = createAsyncThunk(
  'submission/getAuthorStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);