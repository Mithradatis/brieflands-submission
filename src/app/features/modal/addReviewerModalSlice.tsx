import { createSlice } from '@reduxjs/toolkit'
import { getClassificationsList } from '@/app/api/classifications'
import { handleReviewerOperation } from '@/app/api/reviewers'

const suggestOrOpposeList = [ { id: 1 , title: 'Suggest Reviewer' }, { id: 2, title: 'Oppose Reviewer' } ];

const academicDegreeList = ['Not Spcified', 'B.Sc.', 'M.Sc.', 'MD', 'PhD', 'MD and PhD', 'PharmD', 'DDS', 'Other'];

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
    }
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
  handleClassifications 
} = addReviewerModalSlice.actions;

export const addReviewerModalState = ( state: any ) => state.addReviewerModalSlice;

export default addReviewerModalSlice.reducer;
