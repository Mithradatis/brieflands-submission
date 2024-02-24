import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getEditorStepGuide = createAsyncThunk(
  'submission/getEditorStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getEditorStepGuide');
  }
);

export const getEditors = createAsyncThunk(
  'submission/getEditors',
  async (url: string) => {
    return fetchDataFromApi(url, 'getEditors');
  }
);

export const getEditorStepData = createAsyncThunk(
  'submission/getEditorStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getEditorStepData');
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
      // Invalidate cache for getEditorStepData
      const cacheKey = 'getEditorStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);