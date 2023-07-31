import { createSlice } from '@reduxjs/toolkit'

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    isOpen: false,
    transition: '',
    message: '',
  },
  reducers: {
    handleSnackbarOpen: ( state, action ) => {
      return {
        ...state,
        isOpen: true,
        transition: action.payload.transition,
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
