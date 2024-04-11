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
        message: action.payload.message,
        vertical: action.payload.vertical || 'top',
        horizontal: action.payload.horizontal || 'center'
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

export const { 
  handleModalSnackbarOpen, 
  handleModalSnackbarClose 
} = modalSnackbarSlice.actions;

export default modalSnackbarSlice.reducer;
