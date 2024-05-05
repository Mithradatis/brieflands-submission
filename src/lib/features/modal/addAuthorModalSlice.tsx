import { createSlice } from '@reduxjs/toolkit'

type InputStatus = {
  email: boolean;
  firstName: boolean;
  middleName: boolean;
  lastName: boolean;
  isCorresponding: boolean;
}

interface AuthorModalState {
  isVerified: boolean;
  isLoading: boolean;
  isEditing: boolean;
  countriesList: any[];
  countriesPhoneList: any[];
  datatableRows: any[];
  inputStatusDefault: InputStatus;
  inputStatus: InputStatus;
  value: {
    email?: string;
    'first-name'?: string;
    'middle-name'?: string;
    'last-name'?: string;
    'orcid-id'?: string;
    'country'?: string;
    'phone_type'?: string[];
    'country_phone'?: string[];
    'phone_number'?: string[];
    'affiliations'?: string;
    'is_corresponding'?: boolean;
    'correspond_affiliation'?: string; 
  };
}

export const addAuthorModalSlice = createSlice({
  name: 'addAuthorModal',
  initialState: {
    isVerified: false,
    isLoading: false,
    isEditing: false,
    countriesList: [],
    countriesPhoneList: [],
    datatableRows: [],
    inputStatusDefault: {
      email: true,
      firstName: false,
      middleName: false,
      lastName: false,
      isCorresponding: false
    },
    inputStatus: {
      email: true,
      firstName: false,
      middleName: false,
      lastName: false,
      isCorresponding: false
    },
    value: {}
  } as AuthorModalState,
  reducers: {
    handleCheckbox: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.name]: action.payload.value === 'on' ? 'off' : 'on',
        },
      };
    },
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: action.payload.value,
        },
      };
    },
    handleInputAsArray: ( state, action ) => {
      const { name, value } = action.payload;
      return {
        ...state,
        value: {
          ...state.value,
          [ name ]: value !== '' ? [ value ] : [],
        },
      };
    },
    handleInputArray: ( state, action ) => {
      const { name, value } = action.payload;

      return {
        ...state,
        value: {
          ...state.value,
          [ name ]: value !== '' ? value : [],
        },
      };
    },
    handleDisabledInputs: ( state, action ) => {
      return {
        ...state,
        disabledInputs: action.payload
      }
    },
    resetAddAuthorForm: ( state ) => {
      return {
        ...state,
        isEditing: false,
        inputStatus: {
          email: true,
          firstName: false,
          middleName: false,
          lastName: false,
          isCorresponding: false
        },
        value: {}
      };
    },
    saveAuthorModal : ( state ) => {
      return {
        ...state,
        value: {}
      };
    },
    setModalData: ( state, action ) => {
      return {
        ...state,
        value: action.payload
      };
    },
  }
});

export const { 
  handleCheckbox,
  handleInput,
  handleInputAsArray, 
  handleInputArray,
  handleDisabledInputs,
  saveAuthorModal,
  setModalData,
  resetAddAuthorForm
} = addAuthorModalSlice.actions;

export default addAuthorModalSlice.reducer;
