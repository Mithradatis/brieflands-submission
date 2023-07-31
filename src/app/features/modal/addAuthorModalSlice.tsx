import { createSlice } from '@reduxjs/toolkit'
import { searchPeople } from '@/app/api/author'

interface AuthorModalState {
  isVerified: boolean;
  isLoading: boolean;
  datatableRows: any[];
  disabledInputs: boolean;
  value: {
    email?: string;
    'first-name'?: string;
    'middle-name'?: string;
    'last-name'?: string;
    'orcid-id'?: string;
    'phone_type'?: string[];
    'country_phone'?: string[];
    'phone_number'?: string[];
  };
}

export const addAuthorModalSlice = createSlice({
  name: 'addAuthorModal',
  initialState: {
    isVerified: false,
    isLoading: false,
    datatableRows: [],
    disabledInputs: true,
    value: {}
  } as AuthorModalState,
  reducers: {
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
  },
  extraReducers: ( builder ) => {
    builder
      .addCase(searchPeople.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(searchPeople.fulfilled, ( state, action ) => {
        state.isLoading = false;
        const author = action.payload.data.data;
        const phoneType = [];
        const phoneCountry = [];
        const phoneNumber = [];
        phoneType.push( author['phones']['type'] );
        phoneCountry.push( author['phones']['country_phone'] );
        phoneNumber.push( author['phones']['number'] );
        state.value['email'] = action.payload.email;
        author['first_name'] !== null && ( state.value['first-name'] = author['first_name'] );
        author['last_name'] !== null && ( state.value['last-name'] = author['last_name'] );
        author['orcid_id'] !== null && ( state.value['orcid-id'] = author['orcid_id'].toString() );
        phoneType.length > 0 && ( state.value['phone_type'] = phoneType );
        phoneCountry.length > 0 && ( state.value['country_phone'] = phoneCountry );
        phoneNumber.length > 0 && ( state.value['phone_number'] = phoneNumber );
        state.disabledInputs = false;
      });
  },
});

export const { 
  handleInput,
  handleInputAsArray, 
  handleInputArray 
} = addAuthorModalSlice.actions;

export const addAuthorModalState = ( state: any ) => state.addAuthorModalSlice;

export default addAuthorModalSlice.reducer;
