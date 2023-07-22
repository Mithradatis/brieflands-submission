import { createAsyncThunk } from '@reduxjs/toolkit'

export const getSubmissionSteps = createAsyncThunk(
  'submission/fetchInitialState',
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

export const getWorkflow = createAsyncThunk(
  'submission/getWorkflow',
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