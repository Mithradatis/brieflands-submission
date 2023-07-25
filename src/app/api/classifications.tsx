import { createAsyncThunk } from '@reduxjs/toolkit'

export const getClassificationsStepGuide = createAsyncThunk(
  'submission/getClassificationsStepGuide',
  async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getClassificationsStepData = createAsyncThunk(
  'submission/getClassificationsStepData',
  async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getClassificationsList = createAsyncThunk(
    'submission/getClassifications',
    async (url: string) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow'
        });
  
        const data = await response.json();
        return data;
      } catch (error) {
        return error;
      }
    }
);

export const updateClassificationsStepData = createAsyncThunk(
  'submission/updateClassificationsStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.classificationsSlice.value;
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
        throw new Error('Failed to update classifications step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);