import { createSlice } from '@reduxjs/toolkit'
import { 
  getAuthorContributionStepGuide, 
  getAuthorContributionStepData 
} from '@/lib/api/steps/authors-contribution'
import { 
  getFundingSupportStepGuide, 
  getFundingSupportStepData 
} from '@/lib/api/steps/funding-support'
import { 
  getConflictOfInterestsStepGuide, 
  getConflictOfInterestsStepData 
} from '@/lib/api/steps/conflict-of-interests'

export const footnotesSlice = createSlice({
  name: 'footnotes',
  initialState: {
    isLoading: false,
    isVisited: false,
    stepGuide: {
        authorsContribution: null,
        fundingSupport: null,
        conflictOfInterests: null
   },
    value: {
        authors_contribution: {
            text: ''
        },
        funding_support: {
            text: ''
        },
        conflict_of_interests: {
            text: ''
        }
    }
  },
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: {
            text: action.payload.value
          }
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
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
          state.stepGuide.authorsContribution = action.payload.data.value;
        }
      })
      .addCase( getFundingSupportStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getFundingSupportStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.fundingSupport = action.payload.data.value;
        }
      })
      .addCase( getConflictOfInterestsStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getConflictOfInterestsStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide.conflictOfInterests = action.payload.data.value;
        }
      })
      .addCase( getAuthorContributionStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getAuthorContributionStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            authors_contribution: data.step_data
          },
        };
      })
      .addCase( getFundingSupportStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getFundingSupportStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            funding_support: data.step_data
          },
        };
      }).addCase( getConflictOfInterestsStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getConflictOfInterestsStepData.fulfilled, ( state, action: any ) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: {
            ...state.value,
            conflict_of_interests: data.step_data
          },
        };
      });
  },
});

export const { handleInput, handleLoading } = footnotesSlice.actions;

export default footnotesSlice.reducer;
