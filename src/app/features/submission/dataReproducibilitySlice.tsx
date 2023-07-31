import { createSlice } from '@reduxjs/toolkit'
import { getDataReproducibilityStepGuide, getDataReproducibilityStepData } from '@/app/api/dataReproducibility'

export const dataReproducibilitySlice = createSlice({
  name: 'dataReproducibility',
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
      .addCase( getDataReproducibilityStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getDataReproducibilityStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getDataReproducibilityStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getDataReproducibilityStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getDataReproducibilityStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = dataReproducibilitySlice.actions;

export const stepState = ( state: any ) => state.dataReproducibilitySlice;

export default dataReproducibilitySlice.reducer;
