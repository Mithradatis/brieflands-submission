import { createSlice } from '@reduxjs/toolkit'

export const submissionSlice = createSlice({
  name: 'submission',
  initialState: {
    value: {},
    isLoading: false,
    isFormValid: true,
    formStatus: 'new',
    stepGuide: '',
    error: ''
  },
  reducers: {
    handleCheckbox: (state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.name]: !action.payload.value,
        },
      };
    },
    handleInputText: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: action.payload.value,
        },
      };
    },
    handleSelection: ( state, action ) => {
      return {
        ...state,
        value: {
        ...state.value,
        [ action.payload.name ]: action.payload.value,
        },
      };
    },
    formValidator: ( state, action ) => {
      let formIsValid = true;
      for ( const [key, value] of Object.entries( state.value ) ) {
        const input: any = document.querySelector(`#${action.payload} [name=${ key }]`);
        if ( input !== null ) {
          if ( input.required && value === '' ) {
            formIsValid = false;
          }
        }
      }
      return {
        ...state,
        isFormValid: formIsValid
      };
    }
  }
});

export const {
  handleCheckbox, 
  handleInputText, 
  handleSelection, 
  formValidator 
} = submissionSlice.actions;

export const stepState = ( state: any ) => state.submissionSlice.value;

export const formValidation = ( state: any ) => state.submissionSlice.isFormValid;

export const stepGuide = ( state: any ) => state.submissionSlice.stepGuide;

export default submissionSlice.reducer;
