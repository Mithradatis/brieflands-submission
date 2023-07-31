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

export const buildNewWorkflow = createAsyncThunk(
  'submission/buildNewWorkflow',
  async (url: string) => {
    try {
      const response = await fetch( url, {
          method: 'POST',
          credentials: 'include',
          redirect: 'follow'
      });
      if (!response.ok) {
        throw new Error('build a new workflow has failed!');
      }
      const data = await response.json();
      return data;
    } catch( error ) {
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
      if (!response.ok) {
        throw new Error('workflow not found!');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return error;
    }
  }
);