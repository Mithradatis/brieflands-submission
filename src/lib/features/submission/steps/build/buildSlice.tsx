import { createSlice } from '@reduxjs/toolkit'
import { getBuildStepGuide, getBuildStepData, getFinalAgreementGuide } from '@/lib/api/steps/build'

export const buildSlice = createSlice({
  name: 'build',
  initialState: {
    isLoading: false,
    isVisited: false,
    hasError: false,
    errorMessage: '',
    stepGuide: {},
    finalAgreementGuide: {},
    value: {
      terms: false
    }
  },
  reducers: {
    handleCheckbox: ( state, action ) => {
      return {
        ...state,
        value: {
        ...state.value,
        [ action.payload.name ]: !action.payload.value,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getBuildStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getBuildStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getBuildStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getBuildStepData.fulfilled, ( state, action: any ) => {
        if ( action.payload.hasOwnProperty('hasError') ) {
          return {
            ...state,
            hasError: true,
            errorMessage: action.payload.error.data.message
          };
        } else {
          const { data } = action.payload;
          return {
            ...state,
            isLoading: false,
            value: data.step_data,
          };
        }
      })
      .addCase(getFinalAgreementGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getFinalAgreementGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.finalAgreementGuide = action.payload.data.value;
      });
  },
});

export const { handleCheckbox, handleLoading } = buildSlice.actions;

export default buildSlice.reducer;
