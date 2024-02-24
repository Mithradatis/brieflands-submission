import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleSnackbarOpen } from '@/lib/features/snackbar/snackbarSlice'

const cacheDuration: number = parseInt( process.env.CACHE_DURATION ?? '0' );
const cache: any = {};

export const fetchDataFromApi = async ( url: string, cacheKey: string = '' ): Promise<any> => {
  try {
    const now = Date.now();
    if ( cache.hasOwnProperty( cacheKey ) ) {
      if ( cache[cacheKey].data && now - cache[cacheKey].timestamp < cacheDuration ) {
        return cache[cacheKey]['data'];
      }
    }
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      redirect: 'follow',
    });

    if ( !response.ok ) {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();
    if ( !cache[cacheKey] ) {
      cache[cacheKey] = {};
    }
    cache[cacheKey]['data'] = data;
    cache[cacheKey]['timestamp'] = now;

    return data;
  } catch ( error ) {
    throw error;
  }
};

export const deleteCache = ( cacheKey: string ) => {
  delete cache[cacheKey];
}

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

