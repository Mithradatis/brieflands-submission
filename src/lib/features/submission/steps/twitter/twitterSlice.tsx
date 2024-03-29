import { createSlice } from '@reduxjs/toolkit'
import { getTwitterStepGuide, getTwitterStepData } from '@/lib/api/steps/twitter'

export const twitterSlice = createSlice({
  name: 'twitter',
  initialState: {
    isLoading: false,
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
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
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
      });
  },
});

export const { handleInput, handleLoading } = twitterSlice.actions;

export default twitterSlice.reducer;
