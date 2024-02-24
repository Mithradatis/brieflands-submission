import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getSectionStepGuide = createAsyncThunk(
  'submission/getSectionStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getSectionStepGuide');
  }
);

export const getSections = createAsyncThunk(
  'submission/getSections',
  async (url: string) => {
    return fetchDataFromApi(url, 'getSections');
  }
);

export const getSectionStepData = createAsyncThunk(
  'submission/getSectionStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getSectionStepData');
  }
);

export const updateSectionStepData = createAsyncThunk(
  'submission/updateSectionStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.sectionSlice.value;
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
      // Invalidate cache for getSectionStepData
      const cacheKey = 'getSectionStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);