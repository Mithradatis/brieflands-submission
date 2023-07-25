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

export const updateSectionStepData = createAsyncThunk(
  'submission/updateSectionStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.documentSectionSlice.value;
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
        throw new Error('Failed to update section step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);