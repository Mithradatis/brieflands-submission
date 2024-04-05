import { createSlice } from '@reduxjs/toolkit'

type Value = {
  clinical_trial_registration_code: {
    text: string;
  };
  ethical_approval: {
      text: string;
  };
  informed_consent: {
      text: string;
  };
  data_availability: {
      text: string;
  };
}

type StepGuide = {
  clinicalTrialRegistrationCode: string;
  ethicalApproval: string;
  informedConsent: string
  dataAvailability: string
}

export type EthicalStatements = {
  isLoading: false,
  isVisited: false,
  stepGuide: StepGuide;
  value: Value;
}

const initialState: EthicalStatements = {
  isLoading: false,
  isVisited: false,
  stepGuide: {} as StepGuide,
  value: {} as Value
}

export const ethicalStatementsSlice = createSlice({
  name: 'ethicalStatementsSlice',
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
} = ethicalStatementsSlice.actions;

export default ethicalStatementsSlice.reducer;
