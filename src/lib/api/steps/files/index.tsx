import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleSnackbarOpen } from '@features/snackbar/snackbarSlice'

export const getFileTypes = createAsyncThunk(
  'submission/getFileTypes',
  async ( url: string, { getState, dispatch } ) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow',
      });
      if (!response.ok) {
        const errorData = await response.json();
        dispatch( handleSnackbarOpen({ severity: 'error', message: errorData.data.message }) );

        return {};
      }
      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateFilesStepData = createAsyncThunk(
  'submission/updateFilesStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.filesSlice.value;
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
        throw new Error('Failed to update files step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      throw error;
    }
  }
);

export const addFile = createAsyncThunk(
  'submission/addFile',
  async ( file: any, { getState, dispatch }) => {
    const state: any = getState();
    const formData = new FormData();
    formData.append('file_type_id', state.filesSlice.value?.file_type_id);
    state.filesSlice.value?.caption !== undefined && formData.append('caption', state.filesSlice.value?.caption);
    formData.append('file', file);
    const url = `${ process.env.SUBMISSION_API_URL }/${ state.wizard.workflowId }/files/add`;
    const response = await fetch( url, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      body: formData,
    });
    if ( !response.ok ) {
      if ( response.status === 422 ) {
        const errorData = await response.json();
        let message: any;
        if ( errorData.data.hasOwnProperty('message') ) {
          message = errorData.data.message;
          dispatch( handleSnackbarOpen( { severity: 'error', message: message } ) );
        }
        if ( errorData.data.hasOwnProperty('errors') ) {
          Object.entries( errorData.data.errors).map( ([key, value]) => {
            const messages: any = value;
            dispatch( handleSnackbarOpen( { severity: 'error', message: messages[0] } ) );
          });
        }
      } else {
        dispatch( handleSnackbarOpen({  severity: 'error', message: 'Failed to add file', vertical: 'top', horizontal: 'center' } ) );
      }
      throw new Error('Failed to add file.');
    }
    dispatch( handleSnackbarOpen( { severity: 'success', message: 'File uploaded successfuly' } ) );
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ state.wizard.workflowId }/files`;
    try {
      const response = await fetch(getStepDataFromApi, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow',
      });
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteFile = createAsyncThunk(
  'submission/deleteFile',
  async ( payload: any, { getState, dispatch } ) => {
    try {
      const state: any = getState();
      const { url, uuid } = payload;
      const data = {
        "uuid": uuid
      };
      const response = await fetch( url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ),
      });
      if (!response.ok) {
        if ( response.status === 422 ) {
          const errorData = await response.json();
          let message: any;
          if ( errorData.data.hasOwnProperty('message') ) {
            message = errorData.data.message;
            dispatch( handleSnackbarOpen( { severity: 'error', message: message } ) );
          }
          if ( errorData.data.hasOwnProperty('errors') ) {
            Object.entries( errorData.data.errors).map( ([key, value]) => {
              const messages: any = value;
              dispatch( handleSnackbarOpen( { severity: 'error', message: messages[0] } ) );
            });
          }
        } else {
          dispatch( handleSnackbarOpen({  severity: 'error', message: 'Failed to delete file', vertical: 'top', horizontal: 'center' } ) );
        }
        throw new Error('Failed to delete file');
      }
      dispatch( handleSnackbarOpen( { severity: 'success', message: 'File deleted successfuly' } ) );
      const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ state.wizard.workflowId }/files`;
      try {
        const response = await fetch(getStepDataFromApi, {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow',
        });
        const jsonData = await response.json();

        return jsonData;
      } catch (error) {
        throw error;
      }  
    } catch (error) {
      throw error;
    }
  }
);

export const reuseFile = createAsyncThunk(
  'submission/reuseFile',
  async ( payload: any, { getState, dispatch } ) => {
    try {
      const state: any = getState();
      const { url, uuid } = payload;
      const data = {
        "uuid": uuid
      };
      const response = await fetch( url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ),
      });
      if (!response.ok) {
        if ( response.status === 422 ) {
          const errorData = await response.json();
          let message: any;
          if ( errorData.data.hasOwnProperty('message') ) {
            message = errorData.data.message;
            dispatch( handleSnackbarOpen( { severity: 'error', message: message } ) );
          }
          if ( errorData.data.hasOwnProperty('errors') ) {
            Object.entries( errorData.data.errors).map( ([key, value]) => {
              const messages: any = value;
              dispatch( handleSnackbarOpen( { severity: 'error', message: messages[0] } ) );
            });
          }
        } else {
          dispatch( handleSnackbarOpen({  severity: 'error', message: 'Failed to reuse the file', vertical: 'top', horizontal: 'center' } ) );
        }
        throw new Error('Failed to reuse file.');
      }
      const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ state.wizard.workflowId }/files`;
      try {
        const response = await fetch(getStepDataFromApi, {
          method: 'GET',
          credentials: 'include',
          redirect: 'follow',
        });
        const jsonData = await response.json();

        return jsonData;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
);