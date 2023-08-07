import { createSlice } from '@reduxjs/toolkit'
import { getBuildStepGuide, getBuildStepData } from '@/app/api/build'

export const buildSlice = createSlice({
  name: 'build',
  initialState: {
    isLoading: false,
    isFormValid: true,
    isVisited: false,
    hasError: false,
    errorMessage: '',
    stepGuide: {},
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
      .addCase( getBuildStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleCheckbox } = buildSlice.actions;

export const stepState = ( state: any ) => state.buildSlice;

export default buildSlice.reducer;
