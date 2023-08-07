import { createAsyncThunk } from '@reduxjs/toolkit'
import { loadStep } from '@/app/features/wizard/wizardSlice'
import { handleSnackbarOpen } from '@/app/features/snackbar/snackbarSlice'

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

export const getBuildStepGuide = createAsyncThunk(
  'submission/getBuildStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getBuildStepData = createAsyncThunk(
  'submission/getBuildStepData',
  async ( url: string, { getState, dispatch } ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow',
      });

      if ( !response.ok ) {
        const error = await response.json();
        dispatch( loadStep( error.data.step ) );
        dispatch( handleSnackbarOpen( { severity: 'error', message: error } ) );
      }
      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
);