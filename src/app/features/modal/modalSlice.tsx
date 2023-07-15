import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    modalTitle: '',
    modalOpen: false,
    modalForm: null,
    modalFormData: {},
    nestedModalOpen: false,
    nestedModalFormData: {},
    isFormValid: true,
  },
  reducers: {
    handleOpen: ( state, action ) => {
      return {
        ...state,
        modalTitle: action.payload.title,
        modalForm: action.payload.parent,
        modalOpen: true,
      };
    },
    handleClose: ( state ) => {
      return {
        ...state,
        modalOpen: false,
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
    handleInputChange: ( state, action ) => {
      return {
        ...state,
        modalFormData: {
          ...state.modalFormData,
          [ action.payload.name ]: action.payload.value,
        },
      };
    },
    handleSelection: ( state, action ) => {
      return {
        ...state,
        value: {
        ...state.modalFormData,
        [ action.payload.name ]: action.payload.value,
        },
      };
    },
    saveModal : ( state ) => {
      return {
        ...state,
        modalFormData: {},
        isFormValid: true,
        modalOpen: false,
      };
    },
    setFormIsInvalid: ( state ) => {
      return {
        ...state,
        isFormValid: false
      }
    }
  },
});


export const {
  handleOpen, 
  handleClose,
  handleNestedOpen,
  handleNestedClose, 
  handleInputChange, 
  saveModal,
  setFormIsInvalid, 
  handleSelection 
} = modalSlice.actions;

export const modalState = ( state: any ) => state.modalSlice;

export default modalSlice.reducer;
