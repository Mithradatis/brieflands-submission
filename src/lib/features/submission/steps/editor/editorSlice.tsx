import { createSlice } from '@reduxjs/toolkit'

type Value = {
  id: string;
}

export type EditorsListItem = {
  id: string;
  name: string;
}

export type Editor = {
  isLoading: boolean;
  stepGuide: object | string;
  editorsList: EditorsListItem[];
  value: Value;
}

const initialState: Editor = {
  isLoading: false,
  stepGuide: {},
  editorsList: [],
  value: {} as Value
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState: initialState,
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
    },
    setEditors: ( state, action ) => {
      const editors = action.payload.data;
      if ( Object.keys( editors ).length > 0 ) {
        state.editorsList = [];
        for ( const [ key, value ] of Object.entries( editors ) ) {
          const editor: any = value; 
          state.editorsList.push(
            {
              id: editor.id,
              name: `${ 
                editor.attributes.first_name 
              } ${ 
                editor.attributes.middle_name 
              } ${ editor.attributes.last_name }`
            }
          );
        }
      }
    },
    setStepData: ( state, action ) => {
      const stepData = action.payload.data.step_data;
      state.value.id = stepData.length > 0 ? stepData : '';
    },
    setStepGuide: ( state, action ) => {
      state.stepGuide = action.payload.data.value;
    }
  }
});

export const { 
  handleInput, 
  handleLoading,
  setEditors,
  setStepData,
  setStepGuide
} = editorSlice.actions;

export default editorSlice.reducer;
