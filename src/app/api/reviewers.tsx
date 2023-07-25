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

export const getReviewersStepGuide = createAsyncThunk(
  'submission/getReviewersStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getReviewers = createAsyncThunk(
  'submission/getReviewers',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getReviewersStepData = createAsyncThunk(
  'submission/getReviewersStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const updateReviewersStepData = createAsyncThunk(
  'submission/updateReviewersStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.reviewersSlice.value;
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
        throw new Error('Failed to update reviewers step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);