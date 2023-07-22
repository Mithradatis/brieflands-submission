import { createSlice } from '@reduxjs/toolkit'
import { getTwitterStepGuide, getTwitterStepData } from '@/app/api/twitter'

export const twitterSlice = createSlice({
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
        [ action.payload.name ]: action.payload.value,
        },
      };
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getTwitterStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getTwitterStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getTwitterStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getTwitterStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getTwitterStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = twitterSlice.actions;

export const stepState = ( state: any ) => state.twitterSlice;

export default twitterSlice.reducer;
