import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getTypesStepGuide = createAsyncThunk(
  'submission/getTypesStepGuide',
  async ( url: string ) => {
    return fetchDataFromApi( url, 'getTypesStepGuide' );
  }
);

export const getTypes = createAsyncThunk(
  'submission/getTypes',
  async (url: string) => {
    return fetchDataFromApi( url, 'getTypes');
  }
);

export const getTypesStepData = createAsyncThunk(
  'submission/getTypesStepData',
  async ( url: string ) => {
    return fetchDataFromApi( url, 'getTypesStepData' );
  }
);

export const getSameArticlesGuide = createAsyncThunk(
  'submission/getSameArticlesGuide',
  async ( url: string ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      return data.data.value;
    } catch (error) {
      throw error;
    }
  }
);

export const getSameArticles = createAsyncThunk(
  'submission/getSameArticles',
  async ( payload: any ) => {
    const { url, documentDetails } = payload;
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( documentDetails ),
      });
      const data = await response.json();

      return data.data.same_articles;
    } catch (error) {
      throw error;
    }
  }
);

export const updateTypesStepData = createAsyncThunk(
  'submission/updateTypesStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.typesSlice.value;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if ( !response.ok ) {
        throw new Error('Failed to update types step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getTypesStepData
      const cacheKey = 'getTypesStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);