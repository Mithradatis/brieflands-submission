import { createSlice } from '@reduxjs/toolkit'

type Value = {
  id: number
}

export type sectionsListItem = {
  id: number;
  type: string;
  attributes: {
    journal_id: number;
    status: string;
    title: string;
    flag_id: number;
    display_order: number;
    description: string;
  }
}

export type Section = {
  isLoading: boolean;
  stepGuide: object | string;
  sectionsList: sectionsListItem[];
  value: Value;
}

const initialState = {
  isLoading: false,
  stepGuide: {},
  sectionsList: [{}],
  value: {} as Value
}

export const sectionSlice = createSlice({
  name: 'section',
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
    setStepGuide: ( state, action ) => {
      state.stepGuide = action.payload.data.value;
    },
    setStepData: ( state, action ) => {
      const stepData = action.payload.data.step_data;
      state.value.id = stepData !== '' ? parseInt( stepData ) : 0;
    },
    setSections: ( state, action ) => {
      state.sectionsList = action.payload.data;
    }
  }
});

export const { 
  handleInput, 
  handleLoading,
  setStepGuide,
  setStepData,
  setSections
} = sectionSlice.actions;

export default sectionSlice.reducer;
