import { createSlice } from '@reduxjs/toolkit'
import { getFilesStepGuide, getDocumentFiles, getFilesStepData } from '@/app/api/files'

export const documentFilesSlice = createSlice({
  name: 'documentFiles',
  initialState: {
    isLoading: false,
    stepGuide: {},
    documentFilesList: [{}],
    value: {
      old_files: [],
      new_files: []
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
    hanleFilesTable: ( state, action ) => {

    }
  },
  extraReducers( builder ) {
    builder
    .addCase(getFilesStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getFilesStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getDocumentFiles.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getDocumentFiles.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.documentFilesList = action.payload.data;
    })
    .addCase(getFilesStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getFilesStepData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.value = action.payload.data.step_data;
    });
  },
});

export const { handleInput, hanleFilesTable } = documentFilesSlice.actions;

export const stepState = ( state: any ) => state.documentFilesSlice;

export default documentFilesSlice.reducer;
