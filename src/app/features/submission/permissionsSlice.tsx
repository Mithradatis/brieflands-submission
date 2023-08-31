import { createSlice } from '@reduxjs/toolkit'
import { getClinicalTrialRegistrationCodeStepGuide , getClinicalTrialRegistrationCodeStepData } from '@/app/api/clinicalTrialRegistrationCode'
import { getEthicalApprovalStepGuide, getEthicalApprovalStepData } from '@/app/api/ethicalApproval'
import { getInformedConsentStepGuide, getInformedConsentStepData } from '@/app/api/informedConsent'
import { getDataReproducibilityStepGuide, getDataReproducibilityStepData } from '@/app/api/dataReproducibility'

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    isLoading: false,
    isFormValid: true,
    isVisited: false,
    stepGuide: {
        clinicalTrialRegistrationCode: null,
        ethicalApproval: null,
        informedConsent: null,
        dataReproducibility: null
   },
    value: {
        clinicalTrialRegistrationCode: {
            text: ''
        },
        ethicalApproval: {
            text: ''
        },
        informedConsent: {
            text: ''
        },
        dataReproducibility: {
            text: ''
        }
    }
  },
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: {
            text: action.payload.value
          }
        },
      };
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getClinicalTrialRegistrationCodeStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getClinicalTrialRegistrationCodeStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.clinicalTrialRegistrationCode = action.payload.data.value;
        }
      })
      .addCase( getEthicalApprovalStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getEthicalApprovalStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.ethicalApproval = action.payload.data.value;
        }
      })
      .addCase( getInformedConsentStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getInformedConsentStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.informedConsent = action.payload.data.value;
        }
      }).addCase( getDataReproducibilityStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getDataReproducibilityStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.dataReproducibility = action.payload.data.value;
        }
      })
      .addCase( getClinicalTrialRegistrationCodeStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getClinicalTrialRegistrationCodeStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            clinicalTrialRegistrationCode: data.step_data
          },
        };
      })
      .addCase( getEthicalApprovalStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getEthicalApprovalStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            ethicalApproval: data.step_data
          },
        };
      }).addCase( getInformedConsentStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getInformedConsentStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            informedConsent: data.step_data
          },
        };
      }).addCase( getDataReproducibilityStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getDataReproducibilityStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            dataReproducibility: data.step_data
          },
        };
      });
  },
});

export const { handleInput } = permissionsSlice.actions;

export const stepState: any = ( state: any ) => state.permissionsSlice;

export default permissionsSlice.reducer;
