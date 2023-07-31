import { createSlice } from '@reduxjs/toolkit'
import { getClinicalTrialRegistrationCodeStepGuide, getClinicalTrialRegistrationCodeStepData } from '@/app/api/clinicalTrialRegistrationCode'

export const clinicalTrialRegistrationCodeSlice = createSlice({
  name: 'clinicalTrialRegistrationCode',
  initialState: {
    isLoading: false,
    isFormValid: true,
    isVisited: false,
    stepGuide: {},
    value: {
        text: ''
    }
  },
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          text: action.payload,
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
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getClinicalTrialRegistrationCodeStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getClinicalTrialRegistrationCodeStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getClinicalTrialRegistrationCodeStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = clinicalTrialRegistrationCodeSlice.actions;

export const stepState = ( state: any ) => state.clinicalTrialRegistrationCodeSlice;

export default clinicalTrialRegistrationCodeSlice.reducer;
