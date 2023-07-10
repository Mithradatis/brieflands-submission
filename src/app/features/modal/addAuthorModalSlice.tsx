import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { saveModal } from './modalSlice'

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

export const buildAuthorTableRow = createAsyncThunk <
  any,
  undefined,
  { state: RootState, dispatch: any } > (
  'addAuthorModal/buildAuthorTableRow',
  async (_, { getState, dispatch }) => {
    const modalFormData = getState().modalSlice.modalFormData;
    dispatch( saveModal( modalFormData ) );

    return modalFormData;
  }
);

export const addAuthorModalSlice = createSlice({
  name: 'addAuthorModal',
  initialState: {
    datatableRows: [],
  } as AddAuthorModalState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(buildAuthorTableRow.fulfilled, (state, action) => {
      const modalFormData = action.payload;
      const authors = {
        email: modalFormData.authorEmail,
        name: `
          ${(modalFormData.authorFirstName) || ''}
          ${(modalFormData.authorMiddleName) || ''}
          ${(modalFormData.authorLastName) || ''}
        `,
      };
      state.datatableRows = [...state.datatableRows, authors];
    });
  },
});

export const addAuthorModalState = ( state: any ) => state.addAuthorModalSlice;

export default addAuthorModalSlice.reducer;
