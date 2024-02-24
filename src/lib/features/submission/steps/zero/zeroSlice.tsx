import { createSlice } from '@reduxjs/toolkit'
import { getZeroStepGuide, getZeroStepData } from '@/lib/api/steps/zero'

export const zeroSlice = createSlice({
  name: 'abstract',
  initialState: {
    isLoading: false,
    isVisited: false,
    stepGuide: {},
    value: {
        data: false,
        revise_message: ''
    }
  },
  reducers: {
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getZeroStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getZeroStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getZeroStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getZeroStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      });
  },
});

export const { handleLoading } = zeroSlice.actions;

export default zeroSlice.reducer;
