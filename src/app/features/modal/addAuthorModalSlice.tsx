import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { saveModal, setFormIsInvalid } from './modalSlice'

type Author = {
  email: string;
  name: string;
};

type AddAuthorModalState = {
  datatableRows: Author[];
};

type ModalState = {
  modalFormData: any;
};

type RootState = {
  addAuthorModalSlice: AddAuthorModalState;
  modalSlice: ModalState;
};

export const buildAuthorsTableRow = createAsyncThunk <
  any,
  undefined,
  { state: RootState, dispatch: any } > (
  'addAuthorsModal/buildAuthorsTableRow',
  async (_, { getState, dispatch }) => {
    const modalFormData = getState().modalSlice.modalFormData;
    if ( Object.keys(modalFormData).length > 0 ) {
      if (
        modalFormData.authorEmail !== '' 
        && modalFormData.authorFirstName !== ''
        && modalFormData.authorLastName !== ''
        && modalFormData.authorAffiliation !== ''
      ) {
        dispatch( saveModal( modalFormData ) );
  
        return modalFormData;
      } else {
        dispatch( setFormIsInvalid() );

        return false;
      }
    } else {
      dispatch( setFormIsInvalid() );

      return false;
    }
    
  }
);

export const addAuthorModalSlice = createSlice({
  name: 'addAuthorModal',
  initialState: {
    datatableRows: [],
  } as AddAuthorModalState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(buildAuthorsTableRow.fulfilled, (state, action) => {
      const modalFormData = action.payload;
      if ( modalFormData ) {
        const authors = {
          email: modalFormData.authorEmail,
          name: `
            ${(modalFormData.authorFirstName) || ''}
            ${(modalFormData.authorMiddleName) || ''}
            ${(modalFormData.authorLastName) || ''}
          `,
        };
        state.datatableRows = [...state.datatableRows, authors];
      }
    });
  },
});

export const addAuthorModalState = ( state: any ) => state.addAuthorModalSlice;

export default addAuthorModalSlice.reducer;
