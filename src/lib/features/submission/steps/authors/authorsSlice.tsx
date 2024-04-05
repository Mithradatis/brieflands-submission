import { createSlice } from '@reduxjs/toolkit'
import { deleteAuthor, addAuthor } from '@api/steps/authors'

type Affiliations = {
  affiliations: string[];
  correspondings: object;
  names: object[];
}

export type AuthorsListItem = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  orcid: string;
  iscorresponding: string;
}

export type Authors = {
  isLoading: boolean;
  stepGuide: object | string;
  authorsList: AuthorsListItem[];
  authorsAffiliations: Affiliations;
  value: object;
}

const initialState: Authors = {
  isLoading: false,
  stepGuide: {},
  authorsList: [],
  authorsAffiliations: {} as Affiliations,
  value: {}
}

export const authorsSlice = createSlice({
  name: 'authors',
  initialState: initialState,
  reducers: {
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    setAuthorsAffiliations: ( state, action ) => {
      state.authorsAffiliations = action.payload.data.affiliations;
    },
    setAuthorsOrder: ( state, action ) => {
      const authors = action.payload.data.attributes.storage.authors;
      createAuthorsTable( state, authors );
    },
    setStepData: ( state, action ) => {
      const authors = action.payload.data.step_data;
      createAuthorsTable( state, authors );
    },
    setStepGuide: ( state, action ) => {
      state.stepGuide = action.payload.data.value;
    },
  },
  extraReducers( builder ) {
    builder
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
    });
  }
});

export const { 
  handleLoading,
  setAuthorsAffiliations,
  setAuthorsOrder,
  setStepData,
  setStepGuide 
} = authorsSlice.actions;

export default authorsSlice.reducer;
