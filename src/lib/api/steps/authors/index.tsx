import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleOpen, setModalActionButton, setFormIsValid, setFormIsInvalid, saveModal } from '@/lib/features/modal/modalSlice'
import { setModalData, handleDisabledInputs, saveAuthorModal } from '@/lib/features/modal/addAuthorModalSlice'
import { handleModalSnackbarOpen } from '@/lib/features/snackbar/modalSnackbarSlice'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getAuthorStepGuide = createAsyncThunk(
  'submission/getAuthorStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, '');
  }
);

export const getAuthors = createAsyncThunk(
  'submission/getAuthors',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAuthors');
  }
);

export const getAuthorStepData = createAsyncThunk(
  'submission/getAuthorStepData',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAuthorStepData');
  }
);

export const getAllCountries = createAsyncThunk(
  'submission/getAllCountries',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAllCountries');
  }
);

export const getAuthorsAffiliations = createAsyncThunk(
  'submission/getAuthorsAffiliations',
  async (url: string) => {
    return fetchDataFromApi(url, 'getAuthorsAffiliations');
  }
);

export const addAuthor = createAsyncThunk(
  'addAuthorModal/addAuthor',
  async ( modalFormData: any, { getState, dispatch }) => {
    const state: any = getState();
    let url: string = '';
    switch ( state.modalSlice.modalActionButton.action ) {
      case 'add': 
        url = `${ process.env.SUBMISSION_API_URL }/${ state.wizardSlice.workflowId }/authors/add`;
        break;
      case 'edit': 
        url = `${ process.env.SUBMISSION_API_URL }/${ state.wizardSlice.workflowId }/authors/edit`;
        break;  
    }
    const response = await fetch( url, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( modalFormData ),
    });
    if ( !response.ok ) {
      if ( response.status === 422 ) {
        const errorData = await response.json();
        let message: any;
        if ( errorData.data.hasOwnProperty('message') ) {
          message = errorData.data.message;
          dispatch( handleModalSnackbarOpen( { severity: 'error', message: message, vertical: 'top', horizontal: 'center' } ) );
        }
        if ( errorData.data.hasOwnProperty('errors') ) {
          Object.entries( errorData.data.errors).map( ([key, value]) => {
            const message: any = value;
            dispatch( handleModalSnackbarOpen( { severity: 'error', message: message[0], vertical: 'top', horizontal: 'center' } ) );
          });
        }
      } else {
        dispatch( handleModalSnackbarOpen({  severity: 'error', message: 'Failed to update Authors step', vertical: 'top', horizontal: 'center' } ) );
      }
      throw new Error('Failed to update author step');
    }
    const jsonData = await response.json();
    dispatch( saveAuthorModal() );
    dispatch( saveModal() );
    dispatch( handleCloseAuthorModal() );

    return jsonData;
  }
); 

export const handleAuthorOperation = createAsyncThunk(
  'addAuthorsModal/handleAuthorOperation',
  async (_, { getState, dispatch }) => {
    const state: any = getState();
    const modalFormData = state.addAuthorModalSlice.value;
    if ( Object.keys( modalFormData ).length > 0 ) {
      if (
        ( modalFormData?.['email'] !== '' || modalFormData['email'] !== undefined )
        && ( modalFormData['first-name'] !== '' && modalFormData['first-name'] !== undefined )
        && ( modalFormData['last-name'] !== '' && modalFormData['last-name'] !== undefined )
        && ( modalFormData['phone_type'] !== '' && modalFormData['phone_type'] !== undefined )
        && ( modalFormData['country_phone'] !== '' && modalFormData['country_phone'] !== undefined )
        && ( modalFormData['phone_number'] !== '' && modalFormData['phone_number'] !== undefined )
        && ( modalFormData['affiliations'] !== '' && modalFormData['affiliations'] !== undefined )
        && (
          ( modalFormData['is_corresponding'] === undefined || modalFormData['is_corresponding'] === 'off' ) || 
          (  
            modalFormData['is_corresponding'] === 'on'
            && modalFormData['correspond_affiliation'] !== undefined && modalFormData['correspond_affiliation'] !== ''
          )
        )
      ) {
        dispatch( setFormIsValid() );
        try {
          dispatch( addAuthor( modalFormData ) );
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        dispatch( setFormIsInvalid() );
        dispatch( handleModalSnackbarOpen( { severity: 'error', message: 'Please scroll down and check all invalid fields.' , vertical: 'top', horizontal: 'center' } ) );

        return false;
      }
    } else {
      dispatch( setFormIsInvalid() );

      return false;
    }
  }
);

export const updateAuthorStepData = createAsyncThunk(
  'submission/updateAuthorStepData',
  async ( url: string, { getState } ) => {
    try {
      const state: any = getState();
      const data = state.authorsSlice.value;
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
        throw new Error('Failed to update author step');
      }
      const jsonData = await response.json();
      // Invalidate cache for getAuthorStepData
      const cacheKey = 'getAuthorStepData';
      deleteCache( cacheKey );

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const loadEditAuthorForm = createAsyncThunk(
  'submission/loadEditAuthorForm',
  async (authorEmail: string, { getState, dispatch }) => {
    const state: any = getState();
    const authorsSliceData = state.authorsSlice.value;
    const authorData: any = {};
    for (const [key, value] of Object.entries( authorsSliceData )) {
      const authorItem: any = value;
      if ( authorItem.email === authorEmail ) {
        for ( const [key, value] of Object.entries( authorItem ) ) {
          if ( value || value !== '' ) {
            authorData[key] = value;
          }
        }
      }
    }
    dispatch( handleDisabledInputs( false ) );
    dispatch( setModalData( authorData ) );
    dispatch( handleOpen( { title: 'Edit Author', parent: 'authors', mode: 'edit' } ) );
    dispatch( setModalActionButton( { action: 'edit', caption: 'edit' } ) );
  }
);

export const deleteAuthor = createAsyncThunk(
  'submission/deleteAuthor',
  async ( payload: any, { getState } ) => {
    try {
      const state: any = getState();
      const stepData = state.authorsSlice.value;
      const { url, author } = payload;
      let data;
      for ( const [ key, value ] of Object.entries( stepData ) ) {
        const authorItem: any = value;
        if ( authorItem.email === author ) {
          data = {
            "id": key
          };
        }
      }
      const response = await fetch( url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update author step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateAuthorsOrder = createAsyncThunk(
  'submission/updateAuthorsOrder',
  async ( payload: any, { getState } ) => {
    try {
      const state: any = getState();
      const stepData = state.authorsSlice.value;
      const { url, authors } = payload;
      const reorderedAuthors: any = [];
      authors.forEach((author: any) => {
        Object.entries(stepData).forEach(([key, value]) => {
          const authorItem: any = value;
          if ( authorItem.email === author.email ) {
            reorderedAuthors.push( key );
          }
        });
      });
      const data = {
        "ids": reorderedAuthors
      };
      const response = await fetch( url, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update authors order');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const searchPeople = createAsyncThunk(
  'addAuthorsModal/searchPeople',
  async ( email: any, { getState, dispatch }) => {
    try {
      const state: any = getState();
      const url = `${ process.env.SUBMISSION_API_URL }/${ state.wizardSlice.workflowId }/authors/find`;
      const data = {
        "email": email
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
      if ( !response.ok ) {
        if ( response.status === 422 ) {
          const errorData = await response.json();
          dispatch( handleModalSnackbarOpen( { severity: 'error', message: errorData.data.errors.email , vertical: 'top', horizontal: 'center' } ) );
        }
        throw new Error('No author has been find!');
      }
      const jsonData = await response.json();

      return { email: email, data: jsonData };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const handleCloseAuthorModal = createAsyncThunk(
  'addAuthorsModal/handleCloseAuthorModal',
  async () => {
    return true;
  }
);