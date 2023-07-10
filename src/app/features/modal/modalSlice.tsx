import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    modalTitle: '',
    modalOpen: false,
    modalForm: null,
    modalFormData: {},
    bodyBlurred: false
  },
  reducers: {
    handleOpen: ( state, action ) => {
      return {
        ...state,
        modalTitle: action.payload.title,
        modalForm: action.payload.parent,
        modalOpen: true,
        bodyBlurred: true
      };
    },
    handleClose: ( state ) => {
      return {
        ...state,
        modalOpen: false,
        bodyBlurred: false
      };
    },
    handleInputChange: ( state, action ) => {
      return {
        ...state,
        modalFormData: {
          ...state.modalFormData,
          [ action.payload.name ]: action.payload.value,
        },
      };
    },
    saveModal : ( state ) => {
      return {
        ...state,
        modalOpen: false,
        bodyBlurred: false
      };
    },
  },
});


export const { handleOpen, handleClose, handleInputChange, saveModal } = modalSlice.actions;

export const modalState = ( state: any ) => state.modalSlice;

export default modalSlice.reducer;
