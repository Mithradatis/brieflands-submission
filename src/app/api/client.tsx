import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleSnackbarOpen, handleSnackbarClose } from '@/app/features/snackbar/snackbarSlice'

export const getSubmissionSteps = createAsyncThunk(
  'submission/fetchInitialState',
  async ( url: string ) => {
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
  async ( url: string ) => {
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
      console.log( data );
      return data;
    } catch( error ) {
      return error;
    }
  }
);

export const getWorkflow = createAsyncThunk(
  'submission/getWorkflow',
  async ( url: string ) => {
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

export const finishSubmission = createAsyncThunk(
  'submission/finishSubmission',
  async ( url: string, { getState, dispatch } ) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow'
      });
      if (!response.ok) {
        throw new Error('An error occured during finish the  workflow!');
      }
      const data = await response.json();
      dispatch( handleSnackbarOpen( { severity: 'success', message: data.data.message } ) );
      const timer = setTimeout(() => {
        window.location.href = data.data.link;
      }, 5000);

      return () => clearTimeout(timer);
    } catch (error) {
      return error;
    }
  }
);

