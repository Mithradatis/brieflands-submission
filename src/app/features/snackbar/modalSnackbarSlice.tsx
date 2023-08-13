import { createSlice } from '@reduxjs/toolkit'

export const modalSnackbarSlice = createSlice({
  name: 'modal-snackbar',
  initialState: {
    isOpen: false,
    transition: '',
    severity: 'info',
    message: '',
    vertical: 'bottom',
    horizontal: 'left'
  },
  reducers: {
    handleModalSnackbarOpen: ( state, action ) => { 
      return {
        ...state,
        isOpen: true,
        severity: action.payload.severity,
        message: action.payload.message.data.message,
        vertical: action.payload.vertical,
        horizontal: action.payload.horizontal
      }
    },
    handleModalSnackbarClose: ( state ) => {
      return {
        ...state,
        isOpen: false,
        message: '',
        vertical: 'bottom',
        horizontal: 'left'
      }
    },
  },
});

export const { handleModalSnackbarOpen, handleModalSnackbarClose } = modalSnackbarSlice.actions;

export const modalSnackbarState = ( state: any ) => state.modalSnackbarSlice;

export default modalSnackbarSlice.reducer;
