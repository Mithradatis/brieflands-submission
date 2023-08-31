import { createSlice } from '@reduxjs/toolkit'
import { getAuthorStepGuide, getAuthors, getAuthorStepData, deleteAuthor, addAuthor, updateAuthorsOrder, getAuthorsAffiliations } from '@/app/api/author'

interface Author {
  id: number,
  email: string,
  firstname: string,
  lastname: string,
  orcid: string,
  iscorresponding: string
}

export const authorSlice = createSlice({
  name: 'authors',
  initialState: {
    isLoading: false,
    stepGuide: {},
    authorsList: [] as Author[],
    authorsAffiliations: {},
    value: {}
  },
  reducers: {},
  extraReducers( builder ) {
    const createAuthorsTable = ( state: any, authors: any ) => {
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
              lastname: value['last-name'] || value['last_name'] || '',
              orcid: value['orcid-id'] || '',
              iscorresponding: value['is_corresponding'] ? 'Yes' : 'No'
            }
          );
          const authorItem: any = {};
          ( value['email'] !== null && ( authorItem['email'] = value['email'] ) );
          ( value['first_name'] !== null && ( authorItem['first-name'] = value['first-name'] ) );
          ( value['middle_name'] !== null && ( authorItem['middle-name'] = value['middle-name'] ) );
          ( value['last_name'] !== null && ( authorItem['last-name'] = value['last-name'] ) );
          ( value['orcid-id'] !== null && ( authorItem['orcid-id'] = value['orcid-id'] ) );
          ( value['country'] !== null && ( authorItem['country'] = value['country'] ) );
          ( value['phone_type'] && ( authorItem['phone_type'] = value['phone_type'] ) );
          ( value['country_phone'] && ( authorItem['country_phone'] = value['country_phone'] ) );
          ( value['phone_number'] && ( authorItem['phone_number'] = value['phone_number'] ) );
          ( value['affiliations'] !== null && ( authorItem['affiliations'] = value['affiliations'] ) );
          ( value['is_corresponding'] && ( authorItem['is_corresponding'] = value['is_corresponding'] ? 'on' : 'off') );
          ( value['correspond_affiliation'] && ( authorItem['correspond_affiliation'] = value['correspond_affiliation'] ) ); 
          ( state.value as any )[ key ] = authorItem;
        }
      }
    }

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
      createAuthorsTable( state, authors );
    }).addCase(updateAuthorsOrder.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(updateAuthorsOrder.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const authors = action.payload.data.attributes.storage.authors;
      createAuthorsTable( state, authors );
    })
    .addCase(deleteAuthor.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(deleteAuthor.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const authors = action.payload.data.attributes.storage.authors;
      createAuthorsTable( state, authors );
    }).addCase(addAuthor.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(addAuthor.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      const authors = action.payload?.data.attributes.storage.authors;
      createAuthorsTable( state, authors );
    }).addCase(getAuthorsAffiliations.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getAuthorsAffiliations.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.authorsAffiliations = action.payload.data.affiliations;
    });
  }
});

export const stepState = ( state: any ) => state.authorSlice;

export default authorSlice.reducer;
