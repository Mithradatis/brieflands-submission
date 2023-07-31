import { createSlice } from '@reduxjs/toolkit'
import { getAuthorContributionStepGuide, getAuthorContributionStepData } from '@/app/api/authorContribution'

export const authorContributionSlice = createSlice({
  name: 'authorContribution',
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
      .addCase( getAuthorContributionStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getAuthorContributionStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getAuthorContributionStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getAuthorContributionStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getAuthorContributionStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = authorContributionSlice.actions;

export const stepState = ( state: any ) => state.authorContributionSlice;

export default authorContributionSlice.reducer;
