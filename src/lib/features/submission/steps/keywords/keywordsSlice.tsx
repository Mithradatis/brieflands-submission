import { createSlice } from '@reduxjs/toolkit'
import { 
  getKeywords, 
  findKeywords, 
  addNewKeyword } from '@api/steps/keywords'

type Value = {
  ids: string[];
}

type Keyword = {
  id: string;
  type: string;
  attributes: {
    title: string;
    show_in_cloud: boolean;
  }
}

export type Keywords = {
  isInitialized: boolean;
  isLoading: boolean;
  isSearching: boolean;
  stepGuide: object | string;
  keywordsBuffer: Keyword[];
  keywordsList: Keyword[];
  value: Value;
}

const initialState: Keywords = {
  isInitialized: false,
  isLoading: false,
  isSearching: false,
  stepGuide: {},
  keywordsBuffer: [],
  keywordsList: [],
  value: {} as Value
}

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: initialState,
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
        const isDuplicate = state.keywordsList.some(( item: any ) => ( action.payload && item.id === action.payload.id ) );
        if (!isDuplicate) {
          state.keywordsList.push( action.payload );
        }
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    emptyKeywordsList: ( state ) => {
      state.keywordsList = [];
    },
    resetKeywordsBuffer: ( state ) => {
      state.keywordsBuffer = [];
    },
    setKeywords: ( state, action ) => {
      const keyword = action.payload.data;
      state.keywordsList.push( keyword );
    },
    setStepData: ( state, action ) => {
      const stepData = action.payload.data.step_data;
      state.keywordsList = [];
      if ( stepData !== undefined && Object.keys(stepData).length > 0 ) {
        state.value.ids = stepData;
      }
      state.isInitialized = true;
    },
    setStepGuide: ( state, action ) => {
      state.stepGuide = action.payload.data.value;
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(findKeywords.pending, ( state ) => {
      state.isSearching = true;
    })
    .addCase(findKeywords.fulfilled, ( state, action: any ) => {
      state.isSearching = false;
      const keywords = action.payload.data;
      state.keywordsBuffer = [];
      if ( keywords !== undefined ) {
        keywords.map( ( item: any ) => {
          state.keywordsBuffer.push( item );
        });
      }
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

export const { 
  handleInput, 
  handleKeywordsList, 
  handleLoading, 
  emptyKeywordsList, 
  resetKeywordsBuffer,
  setKeywords,
  setStepData,
  setStepGuide 
} = keywordsSlice.actions;

export default keywordsSlice.reducer;
