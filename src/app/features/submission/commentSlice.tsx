import { createSlice } from '@reduxjs/toolkit'
import { getCommentStepGuide, getCommentStepData } from '@/app/api/comment'

export const commentSlice = createSlice({
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
      .addCase( getCommentStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getCommentStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getCommentStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getCommentStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getCommentStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = commentSlice.actions;

export const stepState = ( state: any ) => state.commentSlice;

export default commentSlice.reducer;
