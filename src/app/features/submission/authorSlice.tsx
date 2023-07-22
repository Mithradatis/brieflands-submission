import { createSlice } from '@reduxjs/toolkit'
import { getAuthorStepGuide, getAuthors, getAuthorStepData } from '@/app/api/author'

export const authorSlice = createSlice({
  name: 'authors',
  initialState: {
    isLoading: false,
    stepGuide: {},
    authorsList: [{}],
    value: {
        
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
    .addCase(getAuthorStepGuide.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getAuthorStepGuide.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getAuthors.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getAuthors.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.authorsList = action.payload.data;
    })
    .addCase(getAuthorStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getAuthorStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.value = action.payload.data.step_data;
    });
  },
});

export const { handleInput } = authorSlice.actions;

export const stepState = ( state: any ) => state.authorSlice;

export default authorSlice.reducer;
