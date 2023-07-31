import { createAsyncThunk } from '@reduxjs/toolkit';

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

export const getFilesStepGuide = createAsyncThunk(
  'submission/getFilesStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getDocumentFiles = createAsyncThunk(
  'submission/getDocumentFiles',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getFilesStepData = createAsyncThunk(
  'submission/getFilesStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getFileTypes = createAsyncThunk(
  'submission/getFileTypes',
  async (url: string) => {
    return fetchDataFromApi( url );
  }
);

export const updateFilesStepData = createAsyncThunk(
  'submission/updateFilesStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.documentFilesSlice.value;
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
      console.log(error);
      throw error;
    }
  }
);

export const addFile = createAsyncThunk(
  'submission/addFile',
  async ( file: any, { getState, dispatch }) => {
    const state: any = getState();
    // <li key={file.path}>
    //       {file.path} - {file.size} bytes
    //     </li>
    // const files = {
    //   file_type_id: state.documentFilesSlice.value.file_type_id,
    //   caption: file.name,
    //   file: file
    // }
    const formData = new FormData();
    formData.append('file_type_id', state.documentFilesSlice.value.file_type_id);
    formData.append('caption', file.name);
    formData.append('file', file);
    const url = `${ state.wizardSlice.baseUrl }/api/v1/submission/workflow/${ state.wizardSlice.workflowId }/files/add`;
    const response = await fetch( url, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      body: formData,
    });
    if ( !response.ok ) {
      throw new Error('Failed to update author step');
    }
    const jsonData = await response.json();

    return jsonData;
  }
);

export const deleteFile = createAsyncThunk(
  'submission/deleteFile',
  async ( payload: any, { getState } ) => {
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
        throw new Error('Failed to delete file');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);