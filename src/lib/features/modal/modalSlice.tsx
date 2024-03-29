import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    mode: 'new',
    modalTitle: '',
    modalOpen: false,
    modalForm: null,
    modalActionButton: {
      action: 'add',
      caption: 'add'
    },
    modalFormData: {},
    nestedModalOpen: false,
    nestedModalFormData: {},
    isFormValid: true,
  },
  reducers: {
    handleOpen: ( state, action ) => {
      return {
        ...state,
        mode: action.payload.mode || 'new',
        modalTitle: action.payload.title,
        modalForm: action.payload.parent,
        modalOpen: true,
      };
    },
    handleClose: ( state ) => {
      return {
        ...state,
        modalOpen: false,
        modalActionButton: {
          action: 'add',
          caption: 'add'
        }
      };
    },
    handleNestedOpen: ( state ) => {
      return {
        ...state,
        nestedModalOpen: true,
      };
    },
    handleNestedClose: ( state ) => {
      return {
        ...state,
        nestedModalOpen: false,
      };
    },
    saveModal : ( state ) => {
      return {
        ...state,
        modalFormData: {},
        isFormValid: true,
        modalOpen: false,
        modalActionButton: {
          action: 'add',
          caption: 'add'
        }
      };
    },
    setModalData: ( state, action ) => {
      return {
        ...state,
        modalFormData: action.payload
      };
    },
    setFormIsValid: ( state ) => {
      return {
        ...state,
        isFormValid: true
      }
    },
    setFormIsInvalid: ( state ) => {
      return {
        ...state,
        isFormValid: false
      }
    },
    setModalActionButton: ( state, action ) => {
      return {
        ...state,
        modalActionButton: action.payload
      }
    }
  },
});


export const {
  handleOpen, 
  handleClose,
  handleNestedOpen,
  handleNestedClose,  
  saveModal,
  setModalData,
  setFormIsValid,
  setFormIsInvalid,
  setModalActionButton
} = modalSlice.actions;

export default modalSlice.reducer;
