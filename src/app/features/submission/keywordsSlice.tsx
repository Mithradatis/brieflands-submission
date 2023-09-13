import { createSlice } from '@reduxjs/toolkit'
import { getKeywordsStepGuide, getKeywords, findKeywords, getKeywordsStepData, addNewKeyword } from '@/app/api/keywords'

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: {
    isInitialized: false,
    isLoading: false,
    isSearching: false,
    stepGuide: {},
    keywordsBuffer: [] as any,
    keywordsList: [] as any,
    value: {
      ids: [] as any
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
    },
    handleKeywordsList: ( state, action ) => {
        const isDuplicate = state.keywordsList.some(( item: any ) => item.id === action.payload.id );
        if (!isDuplicate) {
          state.keywordsList.push( action.payload );
        }
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    emptyKeywordsList: ( state ) => {
      state.keywordsList = [];
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
    .addCase(getKeywordsStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getKeywordsStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      state.keywordsList = [];
      if ( Object.keys(stepData).length > 0 ) {
        state.value.ids = stepData;
      }
      state.isInitialized = true;
    })
    .addCase(getKeywords.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getKeywords.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      const keyword = action.payload.data;
      state.keywordsList.push( keyword );
    })
    .addCase(findKeywords.pending, ( state ) => {
      state.isSearching = true;
    })
    .addCase(findKeywords.fulfilled, ( state, action: any ) => {
      state.isSearching = false;
      const keywords = action.payload.data;
      state.keywordsBuffer = [];
      keywords.map( ( item: any ) => {
        state.keywordsBuffer.push( item );
      });
    })
    .addCase(addNewKeyword.pending, (state) => {
      state.isSearching = true;
    })
    .addCase(addNewKeyword.fulfilled, ( state, action ) => {
      state.isSearching = false;
      const keyword = action.payload;
      state.keywordsList.push( keyword );
      state.value.ids.push( keyword.id );
    });
  },
});

export const { handleInput, handleKeywordsList, handleLoading, emptyKeywordsList } = keywordsSlice.actions;

export const stepState = ( state: any ) => state.keywordsSlice;

export default keywordsSlice.reducer;
