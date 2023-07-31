import { createSlice } from '@reduxjs/toolkit'
import { getFundingSupportStepGuide, getFundingSupportStepData } from '@/app/api/fundingSupport'

export const fundingSupportSlice = createSlice({
  name: 'comment',
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
      .addCase( getFundingSupportStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getFundingSupportStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getFundingSupportStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getFundingSupportStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getFundingSupportStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = fundingSupportSlice.actions;

export const stepState = ( state: any ) => state.fundingSupportSlice;

export default fundingSupportSlice.reducer;
