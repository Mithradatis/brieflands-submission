import { createSlice } from '@reduxjs/toolkit'
import { getAuthorStepGuide, getAuthors, getAuthorStepData, deleteAuthor, addAuthor } from '@/app/api/author'

interface Author {
  id: number,
  email: string,
  firstname: string,
  lastname: string
}

export const authorSlice = createSlice({
  name: 'authors',
  initialState: {
    isLoading: false,
    stepGuide: {},
    authorsList: [] as Author[],
    value: {}
  },
  reducers: {},
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
      const authors = action.payload.data.step_data;
      state.authorsList = [];
      const keys = Object.keys(authors);
      if ( keys.length ) {
        for (let index = 0; index < keys.length; index++) {
          const key: any = keys[index];
          const value: any = authors[key];
          state.authorsList.push(
            {
              id: ( index + 1 ),
              email: value['email'], 
              firstname: value['first-name'] || value['first_name'] || '',
              lastname: value['last-name'] || value['last_name'] || ''
            }
          );
        }
      }
      state.value = authors;
    }).addCase(deleteAuthor.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(deleteAuthor.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const authors = action.payload.data.attributes.storage.authors;
      state.authorsList = [];
      const keys = Object.keys(authors);
      if ( keys.length ) {
        for (let index = 0; index < keys.length; index++) {
          const key: any = keys[index];
          const value: any = authors[key];
          state.authorsList.push(
            {
              id: ( index + 1 ),
              email: value['email'], 
              firstname: value['first-name'] || value['first_name'] || '',
              lastname: value['last-name'] || value['last_name'] || '' 
            }
          );
        }
      }
      state.value = authors;
    }).addCase(addAuthor.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(addAuthor.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      const authors = action.payload?.data.attributes.storage.authors;
      const keys = Object.keys(authors);
      state.authorsList = [];
      if ( keys.length ) {
        for (let index = 0; index < keys.length; index++) {
          const key: any = keys[index];
          const value: any = authors[key];
          state.authorsList.push(
            {
              id: ( index + 1 ),
              email: value['email'], 
              firstname: value['first-name'] || value['first_name'] || '',
              lastname: value['last-name'] || value['last_name'] || '' 
            }
          );
        }
      }
      state.value = authors;
    });
  },
});

export const stepState = ( state: any ) => state.authorSlice;

export default authorSlice.reducer;
