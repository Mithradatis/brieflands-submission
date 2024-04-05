import { createSlice } from '@reduxjs/toolkit'

type Value = {
  ids: string[]
}
  
type Classification = {
  id: string;
}

export type Classifications = {
  isLoading: boolean,
  stepGuide: object | string,
  classificationsList: Classification[],
  value: Value
}

const initialState: Classifications = {
  isLoading: false,
  stepGuide: {},
  classificationsList: [],
  value: {} as Value
}
  
export const classificationsSlice = createSlice({
  name: 'classifications',
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
    setClassificationsList: ( state, action ) => {
      state.classificationsList = action.payload.data;
    },
    setStepData: ( state, action ) => {
      state.value.ids = action.payload.data.step_data || state.value?.ids;
    },
    setStepGuide: ( state, action ) => {
      if ( Object.keys(action.payload).length > 0 ) {
        state.stepGuide = action.payload.data.value;
      }
    }
  },
});

export const { 
  handleInput, 
  handleLoading,
  setClassificationsList,
  setStepData,
  setStepGuide
} = classificationsSlice.actions;

export default classificationsSlice.reducer;
