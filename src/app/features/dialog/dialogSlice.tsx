import { createSlice } from '@reduxjs/toolkit'

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    isOpen: false,
    action: '',
    data: '',
    dialogTitle: '',
    dialogContent: {},
    dialogAction: '',
  },
  reducers: {
    handleDialogOpen: ( state, action ) => {
      return {
        ...state,
        isOpen: true,
        action: action.payload.action,
        data: action.payload.data,
        dialogTitle: action.payload.dialogTitle,
        dialogContent: action.payload.dialogContent,
        dialogAction: action.payload.dialogAction
      }
    },
    handleDialogClose: ( state ) => {
      return {
        ...state,
        isOpen: false,
        data: '',
        dialogTitle: '',
        dialogContent: '',
        dialogAction: ''
      }
    },
  },
});

export const { handleDialogOpen, handleDialogClose } = dialogSlice.actions;

export const dialogState = ( state: any ) => state.dialogSlice;

export default dialogSlice.reducer;
