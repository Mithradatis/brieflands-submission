import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleSnackbarOpen } from '@features/snackbar/snackbarSlice'

export const fetchDataFromApi = async ( url: string ) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      redirect: 'follow',
    });
    if ( !response.ok ) {
      throw new Error('Something went wrong!');
    }

    return response.json();
  } catch ( error ) {
    throw error;
  }
};

export const getStepData = createAsyncThunk(
  'submission/getStepData',
  async ( url: string ) => {
    return await fetchDataFromApi( url );
  }
)

export const getStepGuide = createAsyncThunk(
  'submission/getStepGuide',
  async ( url: string ) => {
    return await fetchDataFromApi( url );
  }
)

export const updateStepData = createAsyncThunk(
  'submission/updateStepData',
  async ( payload: { url: string; step: string; data?: any }, { getState } ) => {
    try {
      let { url, step, data } = payload;
      const state: any = getState();
      if ( data === undefined ) {
        data = state[`${ step }Slice`].value;
      }
      const response = await fetch( url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ),
      });
      if ( !response.ok ) {
        throw new Error(`Failed to update ${ step.replace(/_/g, ' ') } step`);
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      throw error;
    }
  }
);

export const getSubmissionSteps = createAsyncThunk(
  'submission/getSubmissionSteps',
  async ( url: string, { getState, dispatch } ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      });

      if ( !response.ok ) {
        if ( response.status === 403 ) {
          const errorData = await response.json();
          dispatch( handleSnackbarOpen( { severity: 'error', message: errorData.data.message } ) );
        }
        
        return false;
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getJournal = createAsyncThunk(
  'submission/getJournal',
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

export const getUser = createAsyncThunk(
  'submission/getUser',
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

export const getScreening = createAsyncThunk(
  'submission/getScreening',
  async ( url: string, { getState, dispatch } ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      });
      if ( !response.ok ) {
        if ( response.status === 403 ) {
          const errorData = await response.json();
          dispatch( handleSnackbarOpen( { severity: 'error', message: errorData.data.message } ) );
        }
        
        return false;
      }
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
      
      return data;
    } catch( error ) {
      return error;
    }
  }
);

export const getWorkflow = createAsyncThunk(
  'submission/getWorkflow',
  async ( url: string, { getState, dispatch } ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      });
      if ( !response.ok ) {
        return response.status
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
      const state: any = getState(); 
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

      return data;
    } catch (error) {
      return error;
    }
  }
);

