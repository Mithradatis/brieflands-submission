import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { saveModal, setFormIsInvalid } from './modalSlice'
import { getClassificationsList } from '@/app/api/classifications'

type Reviewer = {
  email: string;
  name: string;
};

type AddReviewerModalState = {
  datatableRows: Reviewer[];
  classifications: string[];
};

type ModalState = {
  modalFormData: any;
};

type RootState = {
  addAuthorModalSlice: AddReviewerModalState;
  modalSlice: ModalState;
};

export const buildReviewersTableRow = createAsyncThunk <
  any,
  undefined,
  { state: RootState, dispatch: any } > (
  'addReviewersModal/buildReviewersTableRow',
  async (_, { getState, dispatch }) => {
    const modalFormData = getState().modalSlice.modalFormData;
    if ( Object.keys(modalFormData).length > 0 ) {
      if (
        modalFormData.reviewerEmail !== '' 
        && modalFormData.reviewerFirstName !== ''
        && modalFormData.reviewerLastName !== ''
        && modalFormData.reviewerAffiliation !== ''
      ) {
        dispatch( saveModal( modalFormData ) );
  
        return modalFormData;
      } else {
        dispatch( setFormIsInvalid() );

        return false;
      }
    } else {
      dispatch( setFormIsInvalid() );

      return false;
    }
    
  }
);

const suggestOrOpposeList = ['Suggest Reviewer', 'Oppose Reviewer'];

const academicDegreeList = ['Not Spcified', 'B.Sc.', 'M.Sc.', 'MD', 'PhD', 'MD and PhD', 'PharmD', 'DDS', 'Other'];

export const addReviewerModalSlice = createSlice({
  name: 'addReviewerModal',
  initialState: {
    datatableRows: [],
    classifications: [],
    selectedClassifications: [],
    suggestOrOpposeList: suggestOrOpposeList,
    suggestOrOppose: 'Suggest Reviewer',
    academicDegreeList: academicDegreeList,
    academicDegree: 'Not Specified'
  } as AddReviewerModalState,
  reducers: {
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
    .addCase(buildReviewersTableRow.fulfilled, (state, action) => {
      const modalFormData = action.payload;
      if ( modalFormData ) {
        const reviewers = {
          email: modalFormData.reviewerEmail,
          name: `
            ${(modalFormData.reviewerFirstName) || ''}
            ${(modalFormData.reviewerMiddleName) || ''}
            ${(modalFormData.reviewerLastName) || ''}
          `,
        };
        state.datatableRows = [...state.datatableRows, reviewers];
      }
    }).addCase(getClassificationsList.fulfilled, (state, action) => {
      state.classifications = action.payload.classifications;
    });
  },
});

export const { handleSelection, handleClassifications } = addReviewerModalSlice.actions;

export const addReviewerModalState = ( state: any ) => state.addReviewerModalSlice;

export default addReviewerModalSlice.reducer;
