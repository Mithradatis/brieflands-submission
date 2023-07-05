import { createSlice } from '@reduxjs/toolkit'
import { fetchInitialState } from './../../api/client'

export const submissionSlice = createSlice({
  name: 'submission',
  initialState: {
    value: {},
    isLoading: false,
    isFormValid: true,
    formStatus: 'new'
  },
  reducers: {
    handleCheckbox: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: !state.value[ action.payload.name ] ? 'on' : '',
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
        const input = document.querySelector(`#${action.payload} [name=${ key }]`);
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
    },
  },
  extraReducers( builder ) {
    builder
      .addCase(fetchInitialState.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(fetchInitialState.fulfilled, ( state, action ) => {
        state.isLoading = false;
        if ( Object.keys( action.payload ).length > 0 ) {
          state.formStatus = 'edit';
        }
        state.value = action.payload;
      })
      .addCase(fetchInitialState.rejected, ( state, action ) => {
        state.error = action.error.message;
      });
  }
});

export const { handleCheckbox, handleInputText, handleSelection, formValidator } = submissionSlice.actions;

export const stepState = state => state.submissionSlice.value;

export const formValidation = state => state.submissionSlice.isFormValid;

export default submissionSlice.reducer;
