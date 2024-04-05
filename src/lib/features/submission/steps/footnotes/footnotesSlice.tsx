import { createSlice } from '@reduxjs/toolkit'

type Value = {
  authors_contribution: {
    text: string;
  },
  funding_support: {
      text: string;
  },
  conflict_of_interests: {
      text: string;
  }
}

type StepGuide = {
  authorsContribution: string,
  fundingSupport: string,
  conflictOfInterests: string
}

export type Footnotes = {
  isLoading: boolean;
  stepGuide: StepGuide;
  value: Value;
}

const initialState: Footnotes = {
  isLoading: false,
  stepGuide: {} as StepGuide,
  value: {} as Value
}

export const footnotesSlice = createSlice({
  name: 'footnotes',
  initialState: initialState,
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: {
            text: action.payload.value
          }
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    setStepData: ( state, action ) => {
      const { value, step } = action.payload;

      return {
        ...state,
        value: {
          ...state.value,
          [step]: value.data.step_data
        }
      }
    },
    setStepGuide: ( state, action ) => {
      const { value, step } = action.payload;

      return {
        ...state,
        stepGuide: {
          ...state.stepGuide,
          [step]: value.data.value
        }
      }
    }
  }
});

export const { 
  handleInput, 
  handleLoading,
  setStepData,
  setStepGuide
} = footnotesSlice.actions;

export default footnotesSlice.reducer;
