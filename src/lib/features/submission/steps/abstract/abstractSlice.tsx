import { createSlice } from '@reduxjs/toolkit'
import { getAbstractStepGuide, getAbstractStepData } from '@/lib/api/steps/abstract'

export const abstractSlice = createSlice({
  name: 'abstract',
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
      .addCase( getAbstractStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getAbstractStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getAbstractStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getAbstractStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
  },
});

export const { handleInput, handleLoading } = abstractSlice.actions;

export default abstractSlice.reducer;
