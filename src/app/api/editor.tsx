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

export const updateEditorStepData = createAsyncThunk(
  'submission/updateEditorStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.editorSlice.value;
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
        throw new Error('Failed to update editor step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);