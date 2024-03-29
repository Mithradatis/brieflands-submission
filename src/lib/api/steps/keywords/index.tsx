import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getKeywordsStepGuide = createAsyncThunk(
  'submission/getKeywordsStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getKeywordsStepGuide');
  }
);

export const getKeywordsList = createAsyncThunk(
  'submission/getKeywordsList',
  async (url: string) => {
    return fetchDataFromApi(url, 'getKeywordsList');
  }
);

export const getKeywords = createAsyncThunk(
  'submission/getKeywords',
  async (url: string) => {
    return fetchDataFromApi(url, 'getKeywords');
  }
);

export const findKeywords = createAsyncThunk(
  'submission/findKeywords',
  async (url: string) => {
    return fetchDataFromApi(url, 'findKeywords');
  }
);

export const getKeywordsStepData = createAsyncThunk(
  'submission/getKeywordsStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getKeywordsStepData');
  }
);

export const updateKeywordsStepData = createAsyncThunk(
  'submission/updateKeywordsStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.keywordsSlice.value;
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
        throw new Error('Failed to update keywords step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getKeywordsStepData
      const cacheKey = 'getKeywordsStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const addNewKeyword = createAsyncThunk(
  'submission/addNewKeyword',
  async ( payload: any, { getState } ) => {
    try {
      const { url, keyword } = payload;
      const data = {
        "title": keyword,
        "show_in_cloud": true
      }
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
        throw new Error('Failed to update keywords step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);