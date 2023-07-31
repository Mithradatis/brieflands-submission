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
      const editors = action.payload.data;
      if ( Object.keys( editors ).length > 0 ) {
        state.editorsList = [];
        for ( const [ key, value ] of Object.entries( editors ) ) {
          const editor: any = value; 
          state.editorsList.push(
            {
              id: editor.id,
              name: `${ editor.attributes.first_name } ${ editor.attributes.middle_name } ${ editor.attributes.last_name }`
            }
          );
        }
      }
    })
    .addCase(getEditorStepData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getEditorStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const stepData = action.payload.data.step_data;
      state.value.id = stepData.length > 0 ? stepData : '';
    });
  },
});

export const { handleInput } = editorSlice.actions;

export const stepState = ( state: any ) => state.editorSlice;

export default editorSlice.reducer;
