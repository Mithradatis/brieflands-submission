import { createSlice } from '@reduxjs/toolkit'
import { searchPeople, getAllCountries } from '@/app/api/author'

interface AuthorModalState {
  isVerified: boolean;
  isLoading: boolean;
  countriesList: any[];
  datatableRows: any[];
  disabledInputs: boolean;
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
    countriesList: [],
    datatableRows: [],
    disabledInputs: true,
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
  },
  extraReducers: ( builder ) => {
    builder
      .addCase(searchPeople.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(searchPeople.fulfilled, ( state, action ) => {
        state.isLoading = false;
        const author = action.payload.data.data;
        if ( Object.keys( author ).length > 0 ) {
          const phoneType = [];
          const phoneCountry = [];
          const phoneNumber = [];
          phoneType.push( author['phones']['type'] );
          phoneCountry.push( author['phones']['country_phone'] );
          phoneNumber.push( author['phones']['number'] );
          state.value['email'] = action.payload.email;
          author['first_name'] !== '' && ( state.value['first-name'] = author['first_name'] );
          author['middle_name'] !== '' && ( state.value['middle-name'] = author['middle_name'] );
          author['last_name'] !== '' && ( state.value['last-name'] = author['last_name'] );
          ( author['orcid_id'] !== '' && author['orcid_id'] !== null ) && ( state.value['orcid-id'] = author['orcid_id'].toString() );
          author['country'] !== '' && ( state.value['country'] = author['country'] );
          phoneType.length > 0 && ( state.value['phone_type'] = phoneType );
          phoneCountry.length > 0 && ( state.value['country_phone'] = phoneCountry );
          phoneNumber.length > 0 && ( state.value['phone_number'] = phoneNumber );
          author['affiliations'] !== '' && ( state.value['affiliations'] = author['affiliations'] );
          author['is_corresponding'] !== '' && ( state.value['is_corresponding'] = author['is_corresponding'] );
          author['correspond_affiliation'] !== '' && ( state.value['correspond_affiliation'] = author['correspond_affiliation'] );
        }
        state.disabledInputs = false;
      }).addCase(getAllCountries.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(getAllCountries.fulfilled, ( state, action ) => {
        state.isLoading = false;
        const countriesList: any = [];
        action.payload.data.forEach( ( country: any ) => {
          countriesList.push({ id: parseInt( country.id ), label: country.attributes.title });
        });
        state.countriesList = countriesList;
      });
  },
});

export const { 
  handleCheckbox,
  handleInput,
  handleInputAsArray, 
  handleInputArray,
  handleDisabledInputs,
  saveAuthorModal,
  setModalData 
} = addAuthorModalSlice.actions;

export const addAuthorModalState = ( state: any ) => state.addAuthorModalSlice;

export default addAuthorModalSlice.reducer;
