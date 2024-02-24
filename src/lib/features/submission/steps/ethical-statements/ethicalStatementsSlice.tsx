import { createSlice } from '@reduxjs/toolkit'
import { getClinicalTrialRegistrationCodeStepGuide , getClinicalTrialRegistrationCodeStepData } from '@/lib/api/steps/clinical-trial-registration-code'
import { getEthicalApprovalStepGuide, getEthicalApprovalStepData } from '@/lib/api/steps/ethical-approval'
import { getInformedConsentStepGuide, getInformedConsentStepData } from '@/lib/api/steps/informed-consent'
import { getDataAvailabilityStepGuide, getDataAvailabilityStepData } from '@/lib/api/steps/data-availability'

export const ethicalStatementsSlice = createSlice({
  name: 'ethicalStatementsSlice',
  initialState: {
    isLoading: false,
    isVisited: false,
    stepGuide: {
        clinicalTrialRegistrationCode: null,
        ethicalApproval: null,
        informedConsent: null,
        dataAvailability: null
   },
    value: {
        clinical_trial_registration_code: {
            text: ''
        },
        ethical_approval: {
            text: ''
        },
        informed_consent: {
            text: ''
        },
        data_availability: {
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
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
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
      }).addCase( getDataAvailabilityStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getDataAvailabilityStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.dataAvailability = action.payload.data.value;
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
            clinical_trial_registration_code: data.step_data
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
            ethical_approval: data.step_data
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
            informed_consent: data.step_data
          },
        };
      }).addCase( getDataAvailabilityStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getDataAvailabilityStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            data_availability: data.step_data
          },
        };
      });
  },
});

export const { handleInput, handleLoading } = ethicalStatementsSlice.actions;

export default ethicalStatementsSlice.reducer;
