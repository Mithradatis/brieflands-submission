import { createSlice } from '@reduxjs/toolkit'
import { getTypesStepGuide, getDocumentTypes, getTypesStepData } from '@/app/api/types'

export const documentTypesSlice = createSlice({
  name: 'documentTypes',
  initialState: {
    isLoading: false,
    stepGuide: {},
    documentTypesList: [{}],
    value: {
      doc_type: '',
      manuscript_title: ''
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
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(getTypesStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getTypesStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getDocumentTypes.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getDocumentTypes.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.documentTypesList = action.payload.data;
    })
    .addCase(getTypesStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getTypesStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      if ( Object.keys(stepData).length > 0 ) {
        state.value = stepData;
      }
    });
  },
});

export const { handleInput } = documentTypesSlice.actions;

export const stepState = ( state: any ) => state.documentTypesSlice;

export default documentTypesSlice.reducer;
