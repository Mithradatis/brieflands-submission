import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleOpen, setModalActionButton, setFormIsValid, setFormIsInvalid, saveModal } from '@/app/features/modal/modalSlice'
import { setModalData, handleDisabledInputs, saveAuthorModal } from '@/app/features/modal/addAuthorModalSlice'
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

export const getAuthorStepGuide = createAsyncThunk(
  'submission/getAuthorStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getAuthors = createAsyncThunk(
  'submission/getAuthors',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getAuthorStepData = createAsyncThunk(
  'submission/getAuthorStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const addAuthor = createAsyncThunk(
  'addAuthorModal/addAuthor',
  async ( modalFormData: any, { getState, dispatch }) => {
    const state: any = getState();
    let url: string = '';
    switch ( state.modalSlice.modalActionButton.action ) {
      case 'add': 
        url = `${ state.wizardSlice.baseUrl }/api/v1/submission/workflow/${ state.wizardSlice.workflowId }/authors/add`;
        break;
      case 'edit': 
        url = `${ state.wizardSlice.baseUrl }/api/v1/submission/workflow/${ state.wizardSlice.workflowId }/authors/edit`;
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
        dispatch( handleSnackbarOpen( { severity: 'error', message: errorData } ) );
      } else {
        dispatch( handleSnackbarOpen({  severity: 'error', message: 'Failed to update reviewers step' } ) );
      }
      throw new Error('Failed to update author step');
    }
    const jsonData = await response.json();
    dispatch( saveAuthorModal() );
    dispatch( saveModal() );

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
        && ( modalFormData['country_phone'] != '' && modalFormData['country_phone'] !== undefined )
        && ( modalFormData['phone_number'] !== '' && modalFormData['phone_number'] !== undefined )
        && ( modalFormData['affiliations'] !== '' && modalFormData['affiliations'] !== undefined )
        && (
          modalFormData['is_corresponding'] === undefined || 
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
          console.log('Error in addAuthor:', error);
          throw error;
        }
      } else {
        dispatch( setFormIsInvalid() );

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
      const data = state.authorSlice.value;
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
    const authorSliceData = state.authorSlice.value;
    const authorData: any = {};
    for (const [key, value] of Object.entries( authorSliceData )) {
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
    dispatch( handleOpen( { title: 'Edit Author', parent: 'authors' } ) );
    dispatch( setModalActionButton( { action: 'edit', caption: 'edit' } ) );
  }
);

export const deleteAuthor = createAsyncThunk(
  'submission/deleteAuthor',
  async ( payload: any, { getState } ) => {
    try {
      const state: any = getState();
      const stepData = state.authorSlice.value;
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
      const stepData = state.authorSlice.value;
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
      const url = `${ state.wizardSlice.baseUrl }/api/v1/submission/workflow/${ state.wizardSlice.workflowId }/authors/find`;
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
      if (!response.ok) {
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