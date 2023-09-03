import { createSlice } from '@reduxjs/toolkit'
import { getReviewersStepGuide, getReviewersStepData, addReviewer, deleteReviewer } from '@/app/api/reviewers'

export const reviewersSlice = createSlice({
  name: 'reviewers',
  initialState: {
    isLoading: false,
    stepGuide: {},
    reviewersList: [{}],
    value: {}
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
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
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
    .addCase(getReviewersStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getReviewersStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const reviewers = action.payload.data.step_data;
      state.reviewersList = [];
      const keys = Object.keys(reviewers);
      if ( keys.length ) {
        for (let index = 0; index < keys.length; index++) {
          const key: any = keys[index];
          const value: any = reviewers[key];
          state.reviewersList.push(
            {
              id: ( index + 1 ),
              email: value['email'], 
              firstname: value['first-name'] || '',
              lastname: value['last-name'] || '',
              uggested_opposed: value['suggest-or-oppose'] || ''
            }
          );
        }
      }
      state.value = reviewers;
    }).addCase(deleteReviewer.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(deleteReviewer.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const reviewers = action.payload.data.attributes.storage.reviewers;
      state.reviewersList = [];
      const keys = Object.keys(reviewers);
      if ( keys.length ) {
        for (let index = 0; index < keys.length; index++) {
          const key: any = keys[index];
          const value: any = reviewers[key];
          state.reviewersList.push(
            {
              id: ( index + 1 ),
              email: value['email'], 
              firstname: value['first-name'] || value['first_name'] || '',
              lastname: value['last-name'] || value['last_name'] || '',
              suggested_opposed: value['suggest-or-oppose'] || '' 
            }
          );
        }
      }
      state.value = reviewers;
    }).addCase(addReviewer.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(addReviewer.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      const reviewers = action.payload?.data.attributes.storage.reviewers;
      const keys = Object.keys(reviewers);
      state.reviewersList = [];
      if ( keys.length ) {
        for (let index = 0; index < keys.length; index++) {
          const key: any = keys[index];
          const value: any = reviewers[key];
          state.reviewersList.push(
            {
              id: ( index + 1 ),
              email: value['email'], 
              firstname: value['first-name'] || '',
              lastname: value['last-name'] || '',
              suggested_opposed: value['suggest-or-oppose'] || '' 
            }
          );
        }
      }
      state.value = reviewers;
    });
  },
});

export const { handleInput, handleLoading } = reviewersSlice.actions;

export const stepState = ( state: any ) => state.reviewersSlice;

export default reviewersSlice.reducer;
