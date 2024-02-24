import { createAsyncThunk } from '@reduxjs/toolkit'
import { loadStep } from '@/lib/features/wizard/wizardSlice'
import { handleSnackbarOpen } from '@/lib/features/snackbar/snackbarSlice'
import { fetchDataFromApi, deleteCache } from '@/lib/api/client'

export const getBuildStepGuide = createAsyncThunk(
  'submission/getBuildStepGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getBuildStepGuide');
  }
);

export const getFinalAgreementGuide = createAsyncThunk(
  'submission/getFinalAgreementGuide',
  async (url: string) => {
    return fetchDataFromApi(url, 'getFinalAgreementGuide');
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
        console.log(error);
        let unfinishedStep = error.data.step;
        const footnotes = ['authors_contribution', 'funding_support', 'conflict_of_interests'];
        const ethicalStatements = ['clinical_trial_registration_code', 'ethical_approval', 'informed_consent', 'data_availability'];
        if ( footnotes.includes( unfinishedStep ) ) {
          unfinishedStep = 'footnotes';
        }
        if ( ethicalStatements.includes( unfinishedStep ) ) {
          unfinishedStep = 'ethical_statements';
        }
        dispatch( loadStep( unfinishedStep ) );
        dispatch( handleSnackbarOpen( { severity: 'error', message: error.data.message } ) );
      }
      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
);