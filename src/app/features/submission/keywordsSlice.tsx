import { createSlice } from '@reduxjs/toolkit'
import { getKeywordsList } from '@/app/api/client'

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: {
    isLoading: false,
    keywordsList: [''],
  },
  reducers: {
    handleKeywordsList: ( state, action ) => {
        const newKeyword = action.payload;
        newKeyword.filter( (item: any) => {
            if ( !state.keywordsList.includes( item ) ) {
                state.keywordsList.push( item );
            }
        });

        return state;
    },
  },
  extraReducers( builder ) {
    builder
      .addCase(getKeywordsList.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getKeywordsList.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.keywordsList = action.payload.keywordsList;
      });
  },
});

export const { handleKeywordsList } = keywordsSlice.actions;

export const keywordsList = ( state: any ) => state.keywordsSlice.keywordsList;

export default keywordsSlice.reducer;
