import { createSlice } from '@reduxjs/toolkit'
import { getSectionStepGuide, getDocumentSections, getSectionStepData } from '@/app/api/section'

interface Value {
  id: number
}

export const documentSectionSlice = createSlice({
  name: 'documentSection',
  initialState: {
    isLoading: false,
    stepGuide: {},
    documentSectionsList: [{}],
    value: {} as Value
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
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(getSectionStepGuide.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getSectionStepGuide.fulfilled, ( state, action ) => {
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
    .addCase(getSectionStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getSectionStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      state.value.id = stepData !== '' ? parseInt( stepData ) : 0;
    });
  },
});

export const { handleInput, handleLoading } = documentSectionSlice.actions;

export const stepState = ( state: any ) => state.documentSectionSlice;

export default documentSectionSlice.reducer;
