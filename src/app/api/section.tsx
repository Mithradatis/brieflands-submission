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

export const getSectionStepGuide = createAsyncThunk(
  'submission/getSectionStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getDocumentSections = createAsyncThunk(
  'submission/getDocumentSections',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getSectionStepData = createAsyncThunk(
  'submission/getSectionStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);