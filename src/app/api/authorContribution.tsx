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

export const updateAuthorContributionStepData = createAsyncThunk(
  'submission/updateAuthorContributionStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.authorContributionSlice.value;
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
        throw new Error('Failed to update author contribution step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);