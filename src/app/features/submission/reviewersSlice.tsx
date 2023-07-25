import { createSlice } from '@reduxjs/toolkit'
import { getReviewersStepGuide, getReviewers, getReviewersStepData } from '@/app/api/reviewers'

export const reviewersSlice = createSlice({
  name: 'authors',
  initialState: {
    isLoading: false,
    stepGuide: {},
    authorsList: [{}],
    value: {
        
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
    .addCase(getReviewersStepGuide.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getReviewersStepGuide.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getReviewers.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getReviewers.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.authorsList = action.payload.data;
    })
    .addCase(getReviewersStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getReviewersStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.value = action.payload.data.step_data;
    });
  },
});

export const { handleInput } = reviewersSlice.actions;

export const stepState = ( state: any ) => state.reviewersSlice;

export default reviewersSlice.reducer;
