import { createSlice } from '@reduxjs/toolkit'

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    isOpen: false,
    transition: '',
    severity: 'info',
    message: '',
  },
  reducers: {
    handleSnackbarOpen: ( state, action ) => {
      return {
        ...state,
        isOpen: true,
        severity: action.payload.severity,
        message: action.payload.message
      }
    },
    handleSnackbarClose: ( state ) => {
      return {
        ...state,
        isOpen: false,
        message: ''
      }
    },
  },
});

export const { handleSnackbarOpen, handleSnackbarClose } = snackbarSlice.actions;

export const snackbarState = ( state: any ) => state.snackbarSlice;

export default snackbarSlice.reducer;
