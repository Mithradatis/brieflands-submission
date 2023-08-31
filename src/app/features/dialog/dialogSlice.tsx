import { createSlice } from '@reduxjs/toolkit'

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    isOpen: false,
    actions: {},
    approvePhrase: 'Yes',
    denyPhrase: 'No',
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
        actions: action.payload.actions,
        approvePhrase: action.payload.approvePhrase || 'Yes',
        denyPhrase: action.payload.denyPhrase || 'No',
        data: action.payload.data || '',
        dialogTitle: action.payload.dialogTitle,
        dialogContent: action.payload.dialogContent,
        dialogAction: action.payload.dialogAction
      }
    },
    handleDialogClose: ( state ) => {
      return {
        ...state,
        isOpen: false,
        actions: {},
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
