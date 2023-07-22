import { createSlice } from '@reduxjs/toolkit'
import { getKeywordsStepGuide, getKeywordsList, getKeywordsStepData } from '@/app/api/keywords'

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: {
    isLoading: false,
    stepGuide: {},
    keywordsList: [{}],
    value: {
      ids: []
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
    .addCase(getKeywordsStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getKeywordsStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getKeywordsList.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getKeywordsList.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.keywordsList = action.payload.data;
    })
    .addCase(getKeywordsStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getKeywordsStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      if ( Object.keys(stepData).length > 0 ) {
        state.value.ids = stepData;
      }
    });
  },
});

export const { handleInput } = keywordsSlice.actions;

export const stepState = ( state: any ) => state.keywordsSlice;

export default keywordsSlice.reducer;
