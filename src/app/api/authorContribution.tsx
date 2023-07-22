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

export const getAuthorContributionStepGuide = createAsyncThunk(
  'submission/getAuthorContributionStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getAuthorContributionStepData = createAsyncThunk(
  'submission/getAuthorContributionStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);