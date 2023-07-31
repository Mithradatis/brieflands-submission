import { createSlice } from '@reduxjs/toolkit'
import { getConflictOfInterestsStepGuide, getConflictOfInterestsStepData } from '@/app/api/conflictOfInterests'

export const conflictOfInterestsSlice = createSlice({
  name: 'conflictOfInterests',
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
      .addCase( getConflictOfInterestsStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getConflictOfInterestsStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getConflictOfInterestsStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getConflictOfInterestsStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getConflictOfInterestsStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = conflictOfInterestsSlice.actions;

export const stepState = ( state: any ) => state.conflictOfInterestsSlice;

export default conflictOfInterestsSlice.reducer;
