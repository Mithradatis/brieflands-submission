import { createSlice } from '@reduxjs/toolkit'
import { searchPeople, getAllCountries, loadEditAuthorForm, handleCloseAuthorModal } from '@/app/api/author'

interface AuthorModalState {
  isVerified: boolean;
  isLoading: boolean;
  isEditing: boolean;
  countriesList: any[];
  countriesPhoneList: any[];
  datatableRows: any[];
  inputStatus: {
    email: boolean;
    firstName: boolean;
    middleName: boolean;
    lastName: boolean;
    orcid: boolean;
    country: boolean;
    phoneType: boolean;
    countryPhone: boolean;
    phoneNumber: boolean;
    isCorresponding: boolean;
  };
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
    inputStatus: {
      email: true,
      firstName: false,
      middleName: false,
      lastName: false,
      orcid: false,
      country: false,
      phoneType: false,
      countryPhone: false,
      phoneNumber: false,
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
    }
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
          if ( action.payload.email ) {
            state.inputStatus.email = false;
          }
          if ( author['first_name'] !== '' ) {
            state.value['first-name'] = author['first_name'];
          } else {
            state.inputStatus.firstName = true;
          }
          if ( author['middle_name'] !== '' ) {
            state.value['middle-name'] = author['middle_name'];
          } else {
            state.inputStatus.middleName = true;
          }
          if ( author['last_name'] !== '' ) {
            state.value['last-name'] = author['last_name'];
          } else {
            state.inputStatus.lastName = true;
          }
          if ( author['orcid_id'] !== '' && author['orcid_id'] !== null ) {
            state.value['orcid-id'] = author['orcid_id'].toString();
          } else {
            state.inputStatus.orcid = true;
          }
          if ( author['country'] !== '' ) {
            state.value['country'] = author['country'];
            state.inputStatus.country = false;
          } else {
            state.inputStatus.country = true;
          }
          if ( phoneType.length > 0 && phoneType[0] !== '' ) {
            state.value['phone_type'] = phoneType;
          } else {
            state.inputStatus.phoneType = true;
          }
          if ( phoneCountry.length > 0 && phoneCountry[0] !== '' ) {
            state.value['country_phone'] = phoneCountry;
          } else {
            state.inputStatus.countryPhone = true;
          }
          if ( phoneNumber.length > 0 && phoneNumber[0] !== '' ) {
            state.value['phone_number'] = phoneNumber;
          } else {
            state.inputStatus.phoneNumber = true;
          }
          if ( author['affiliations'] !== '' ) {
            state.value['affiliations'] = author['affiliations'];
          }
          if ( author['is_corresponding'] !== '' ) {
            state.value['is_corresponding'] = author['is_corresponding'];
          } else {
            state.inputStatus.isCorresponding = true;
          }
          if ( author['correspond_affiliation'] !== '' ) {
            state.value['correspond_affiliation'] = author['correspond_affiliation'];
          }
        } else {
          state.inputStatus.email = false;
          state.inputStatus.firstName = true;
          state.inputStatus.middleName = true;
          state.inputStatus.lastName = true;
          state.inputStatus.orcid = true;
          state.inputStatus.country = true;
          state.inputStatus.phoneType = true;
          state.inputStatus.countryPhone = true;
          state.inputStatus.phoneNumber = true;
        }
      }).addCase(getAllCountries.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(getAllCountries.fulfilled, ( state, action ) => {
        state.isLoading = false;
        const countriesList: any = [];
        const countriesPhoneList: any = [];
        action.payload.data.forEach( ( country: any ) => {
          countriesList.push({ id: parseInt( country.id ), label: country.attributes.title });
          countriesPhoneList.push({ id: parseInt( country.id ), label: country.attributes.title });
        });
        state.countriesList = countriesList;
        state.countriesPhoneList = countriesList;
      }).addCase(loadEditAuthorForm.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(loadEditAuthorForm.fulfilled, ( state ) => {
        state.isLoading = false;
        state.isEditing = true;
        if ( state.value['email'] !== '' ) {
          state.inputStatus.email = false;
        }
        if ( state.value['first-name'] !== undefined && state.value['first-name'] !== '' ) {
          state.inputStatus.firstName = false;
        } else {
          state.inputStatus.firstName = true;
        }
        if ( state.value['middle-name'] !== undefined && state.value['middle-name'] !== '' ) {
          state.inputStatus.middleName = false;
        } else {
          state.inputStatus.middleName = true;
        }
        if ( state.value['last-name'] !== undefined && state.value['last-name'] !== '' ) {
          state.inputStatus.lastName = false;
        } else {
          state.inputStatus.lastName = true;
        }
        if ( state.value['orcid-id'] !== undefined && state.value['orcid-id'] !== '' && state.value['orcid-id'] !== null ) {
          state.inputStatus.orcid = false;
        } else {
          state.inputStatus.orcid = true;
        }
        if ( state.value['country'] !== undefined && state.value['country'] !== '' ) {
          state.inputStatus.country = false;
        } else {
          state.inputStatus.country = true;
        }
        if ( state.value['phone_type'] !== undefined && state.value['phone_type'][0] !== '' ) {
          state.inputStatus.phoneType = false;
        } else {
          state.inputStatus.phoneType = true;
        }
        if ( state.value['country_phone'] !== undefined && state.value['country_phone'][0] !== '' ) {
          state.inputStatus.countryPhone = false;
        } else {
          state.inputStatus.countryPhone = true;
        }
        if ( state.value['phone_number'] !== undefined && state.value['phone_number'][0] !== '' ) {
          state.inputStatus.phoneNumber = false;
        } else {
          state.inputStatus.phoneNumber = true;
        }
      }).addCase(handleCloseAuthorModal.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(handleCloseAuthorModal.fulfilled, ( state ) => {
        state.isLoading = false;
        state.isEditing = false;
        state.inputStatus.email = true;
        state.inputStatus.firstName = false;
        state.inputStatus.middleName = false;
        state.inputStatus.lastName = false;
        state.inputStatus.orcid = false;
        state.inputStatus.country = false;
        state.inputStatus.phoneType = false;
        state.inputStatus.countryPhone = false;
        state.inputStatus.phoneNumber = false;
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
