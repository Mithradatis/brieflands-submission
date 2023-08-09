import { createSlice } from '@reduxjs/toolkit'
import { getClassificationsList } from '@/app/api/classifications'

const suggestOrOpposeList = [ 
  { id: 1 , title: 'Suggest Reviewer' }, 
  { id: 2, title: 'Oppose Reviewer' } 
];

const academicDegreeList = [
  { id: 0, title: 'Not Spcified' }, 
  { id: 1, title: 'B.Sc.' }, 
  { id: 2, title: 'M.Sc.' }, 
  { id: 3, title: 'MD' },
  { id: 4, title: 'PhD' },
  { id: 5, title: 'MD and PhD' },
  { id: 6, title: 'PharmD' }, 
  { id: 7, title: 'DDS' }, 
  { id: 8, title: 'Other' }
];

export const addReviewerModalSlice = createSlice({
  name: 'addReviewerModal',
  initialState: {
    datatableRows: [],
    classificationsList: [],
    selectedClassifications: [],
    suggestOrOpposeList: suggestOrOpposeList,
    academicDegreeList: academicDegreeList,
    academicDegree: 'Not Specified',
    value: {
      'suggest-or-oppose': 1
    }
  },
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
    handleSelection: ( state, action ) => {
      return {
        ...state,
        [ action.payload.name ]: action.payload.value,
      };
    },
    handleClassifications: ( state, action ) => {
      return {
        ...state,
        selectedClassifications: action.payload,
      };
    },
    saveReviewerModal : ( state ) => {
      return {
        ...state,
        value: {
          'suggest-or-oppose': 1
        },
      };
    },
    setModalData: ( state, action ) => {
      return {
        ...state,
        value: action.payload
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClassificationsList.fulfilled, ( state, action ) => {
        state.classificationsList = action.payload.data;
      });
  },
});

export const {
  handleSelection, 
  handleInput, 
  handleClassifications,
  saveReviewerModal,
  setModalData 
} = addReviewerModalSlice.actions;

export const addReviewerModalState = ( state: any ) => state.addReviewerModalSlice;

export default addReviewerModalSlice.reducer;
