import { createSlice } from '@reduxjs/toolkit'
import { 
  getReviewersStepGuide, 
  getReviewersStepData, 
  addReviewer, 
  deleteReviewer 
} from '@api/steps/reviewers'

const createReviewersTable = ( state: any, reviewers: object[] ) => {
  state.reviewersList = [];
  const keys = Object.keys( reviewers );
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
}

type ReviewersListItem = {

}

export type Reviewers = {
  isLoading: boolean;
  stepGuide: object | string;
  reviewersList: ReviewersListItem[];
  value: object;
}

const initialState: Reviewers = {
  isLoading: false,
  stepGuide: {},
  reviewersList: [],
  value: {}
}

export const reviewersSlice = createSlice({
  name: 'reviewers',
  initialState: initialState,
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
    },
    setStepData: ( state, action ) => {
      const reviewers = action.payload.data.step_data;
      createReviewersTable( state, reviewers );
    },
    setStepGuide: ( state, action ) => {
      state.stepGuide = action.payload.data.value;
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(deleteReviewer.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(deleteReviewer.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const reviewers = action.payload.data.attributes.storage.reviewers;
      createReviewersTable( state, reviewers );
    }).addCase(addReviewer.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(addReviewer.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      const reviewers = action.payload?.data.attributes.storage.reviewers;
      createReviewersTable( state, reviewers );
    });
  },
});

export const { 
  handleInput, 
  handleLoading,
  setStepData,
  setStepGuide
} = reviewersSlice.actions;

export default reviewersSlice.reducer;
