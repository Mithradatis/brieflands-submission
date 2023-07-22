import { createSlice } from '@reduxjs/toolkit'
import { getInformedConsentStepGuide, getInformedConsentStepData } from '@/app/api/informedConsent'

export const informedConsentSlice = createSlice({
  name: 'informedConsent',
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
        [ action.payload.name ]: action.payload.value,
        },
      };
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getInformedConsentStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getInformedConsentStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getInformedConsentStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getInformedConsentStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getInformedConsentStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = informedConsentSlice.actions;

export const stepState = ( state: any ) => state.informedConsentSlice;

export default informedConsentSlice.reducer;
