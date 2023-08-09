import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleOpen, setModalActionButton, saveModal, setFormIsValid, setFormIsInvalid } from '@/app/features/modal/modalSlice'
import { saveReviewerModal, setModalData } from '../features/modal/addReviewerModalSlice'
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

export const getReviewersStepGuide = createAsyncThunk(
  'submission/getReviewersStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getReviewers = createAsyncThunk(
  'submission/getReviewers',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const getReviewersStepData = createAsyncThunk(
  'submission/getReviewersStepData',
  async (url: string) => {
    return fetchDataFromApi(url);
  }
);

export const addReviewer = createAsyncThunk(
  'addReviewerModal/addReviewer',
  async ( modalFormData: any, { getState, dispatch }) => {
    const state: any = getState();
    let url: string = '';
    switch ( state.modalSlice.modalActionButton.action ) {
      case 'add': 
        url = `${ state.wizardSlice.baseUrl }/api/v1/submission/workflow/${ state.wizardSlice.workflowId }/reviewers/add`;
        break;
      case 'edit': 
        url = `${ state.wizardSlice.baseUrl }/api/v1/submission/workflow/${ state.wizardSlice.workflowId }/reviewers/edit`;
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
        dispatch( handleSnackbarOpen( { severity: 'error', message: errorData.message } ) );
      } else {
        dispatch( handleSnackbarOpen({  severity: 'error', message: 'Failed to update reviewers step' } ) );
      }
      throw new Error('Failed to update reviewers step');
    }
    const jsonData = await response.json();
    dispatch( saveReviewerModal() );
    dispatch( saveModal() );

    return jsonData;
  }
);

export const handleReviewerOperation = createAsyncThunk(
  'addReviewerModal/handleReviewerOperation',
  async (_, { getState, dispatch }) => {
    const state: any = getState();
    const modalFormData = state.addReviewerModalSlice.value;
    if ( Object.keys( modalFormData ).length > 0 ) {
      if (
        ( modalFormData?.['email'] !== '' || modalFormData['email'] !== undefined )
        && ( modalFormData['first-name'] !== '' && modalFormData['first-name'] !== undefined )
        && ( modalFormData['last-name'] !== '' && modalFormData['last-name'] !== undefined )
      ) {
        dispatch( setFormIsValid() );
        try {
          dispatch( addReviewer( modalFormData ) );
        } catch ( error ) {
          console.log( 'Error in addAuthor:', error );
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

export const loadEditReviewerForm = createAsyncThunk(
  'submission/loadEditReviewerForm',
  async (reviewerEmail: string, { getState, dispatch }) => {
    const state: any = getState();
    const reviewersSliceData = state.reviewersSlice.value;
    const reviewerData: any = {};
    for (const [key, value] of Object.entries( reviewersSliceData )) {
      const reviewerItem: any = value;
      if ( reviewerItem.email === reviewerEmail ) {
        for ( const [key, value] of Object.entries( reviewerItem ) ) {
          if ( value || value !== '' ) {
            reviewerData[key] = value;
          }
        }
      }
    }
    dispatch( setModalData( reviewerData ) );
    dispatch( handleOpen( { title: 'Edit Reviewer', parent: 'reviewers' } ) );
    dispatch( setModalActionButton( { action: 'edit', caption: 'edit' } ) );
  }
);

export const deleteReviewer = createAsyncThunk(
  'submission/deleteReviewer',
  async ( payload: any, { getState } ) => {
    try {
      const state: any = getState();
      const stepData = state.reviewersSlice.value;
      const { url, reviewer } = payload;
      let data;
      for ( const [ key, value ] of Object.entries( stepData ) ) {
        const reviewerItem: any = value;
        if ( reviewerItem.email === reviewer ) {
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
        throw new Error('Failed to update reviewers step');
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

