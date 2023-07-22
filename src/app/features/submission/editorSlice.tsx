import { createSlice } from '@reduxjs/toolkit'
import { getEditorStepGuide, getEditors, getEditorStepData } from '@/app/api/editor'

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    isLoading: false,
    stepGuide: {},
    editorsList: [{}],
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
    .addCase(getEditorStepGuide.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getEditorStepGuide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getEditors.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getEditors.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.editorsList = action.payload.data;
    })
    .addCase(getEditorStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getEditorStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      if ( Object.keys(stepData).length > 0 ) {
        state.value = stepData;
      }
    });
  },
});

export const { handleInput } = editorSlice.actions;

export const stepState = ( state: any ) => state.editorSlice;

export default editorSlice.reducer;
