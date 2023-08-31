import { createSlice } from '@reduxjs/toolkit'
import { getAuthorContributionStepGuide, getAuthorContributionStepData } from '@/app/api/authorContribution'
import { getFundingSupportStepGuide, getFundingSupportStepData } from '@/app/api/fundingSupport'
import { getConflictOfInterestsStepGuide, getConflictOfInterestsStepData } from '@/app/api/conflictOfInterests'

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
        authorsContribution: {
            text: ''
        },
        fundingSupport: {
            text: ''
        },
        conflictOfInterests: {
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
            authorsContribution: data.step_data
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
            fundingSupport: data.step_data
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
            conflictOfInterests: data.step_data
          },
        };
      });
  },
});

export const { handleInput } = footnotesSlice.actions;

export const stepState: any = ( state: any ) => state.footnotesSlice;

export default footnotesSlice.reducer;
