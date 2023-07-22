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