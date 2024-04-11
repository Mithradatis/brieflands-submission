import { createSlice } from '@reduxjs/toolkit'
import { 
  searchPeople, 
  loadEditAuthorForm, 
  handleCloseAuthorModal 
} from '@api/steps/authors'

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
          }
          if ( author['country'] !== '' ) {
            state.value['country'] = author['country'];
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
        }
      })
      .addCase(loadEditAuthorForm.pending, ( state ) => {
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
      }).addCase(handleCloseAuthorModal.pending, ( state ) => {
        state.isLoading = true;
      }).addCase(handleCloseAuthorModal.fulfilled, ( state ) => {
        state.isLoading = false;
        state.isEditing = false;
        Object.entries( state.inputStatus ).forEach(([key, value]) => {
          state.inputStatus[key as keyof InputStatus] = state.inputStatusDefault[key as keyof InputStatus]
        });
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
  setModalData,
  resetAddAuthorForm
} = addAuthorModalSlice.actions;

export default addAuthorModalSlice.reducer;
