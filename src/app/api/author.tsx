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

export const updateAuthorStepData = createAsyncThunk(
  'submission/updateAuthorStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.authorSlice.value;
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
        throw new Error('Failed to update author step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);