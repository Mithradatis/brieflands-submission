import { createSlice } from '@reduxjs/toolkit'
import { getCommentsStepGuide, getCommentsStepData } from '@/lib/api/steps/comments'

export const commentSlice = createSlice({
  name: 'comment',
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
      .addCase( getCommentsStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getCommentsStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getCommentsStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getCommentsStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      });
  },
});

export const { handleInput, handleLoading } = commentSlice.actions;

export default commentSlice.reducer;
