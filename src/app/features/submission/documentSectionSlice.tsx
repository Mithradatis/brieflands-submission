import { createSlice } from '@reduxjs/toolkit'
import { getSectionStepGuide, getDocumentSections, getSectionStepData } from '@/app/api/section'

export const documentSectionSlice = createSlice({
  name: 'documentSection',
  initialState: {
    isLoading: false,
    stepGuide: {},
    documentSectionsList: [{}],
    value: {
      id: ''
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
    .addCase(getSectionStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getSectionStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getDocumentSections.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getDocumentSections.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.documentSectionsList = action.payload.data;
    })
    .addCase(getSectionStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getSectionStepData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.value = action.payload.data.step_data;
    });
  },
});

export const { handleInput } = documentSectionSlice.actions;

export const stepState = ( state: any ) => state.documentSectionSlice;

export default documentSectionSlice.reducer;
