import { createSlice } from '@reduxjs/toolkit'
import { getFinalAgreementGuide } from '@api/steps/build'

type Value = {
  terms: boolean;
  files: {
    full: string;
  };
  standard_word_count: string;
  word_count_include_in_fee: string;
  word_count: string;
  prices: any;
  journal_agreement_message: string;
  final_message: object;
}

export type Build = {
  isLoading: boolean;
  isVisited: boolean;
  hasError: boolean;
  errorMessage: string;
  stepGuide: object;
  finalAgreementGuide: object;
  value: Value
}

const initialState: Build = {
  isLoading: false,
  isVisited: false,
  hasError: false,
  errorMessage: '',
  stepGuide: {},
  finalAgreementGuide: {},
  value: {} as Value
}

export const buildSlice = createSlice({
  name: 'build',
  initialState: initialState,
  reducers: {
    handleCheckbox: ( state, action ) => {
      return {
        ...state,
        value: {
        ...state.value,
        [ action.payload.name ]: !action.payload.value,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    setStepData: ( state, action ) => {
      if ( action.payload.hasOwnProperty( 'hasError' ) ) {
        return {
          ...state,
          hasError: true,
          errorMessage: action.payload.error.data.message
        };
      } else {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      }
    },
    setStepGuide: ( state, action ) => {
      if ( Object.keys( action.payload ).length > 0 ) {
        state.stepGuide = action.payload.data.value;
      }
    }
  },
  extraReducers( builder ) {
    builder
      .addCase(getFinalAgreementGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getFinalAgreementGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.finalAgreementGuide = action.payload.data.value;
      });
  },
});

export const {
  handleCheckbox, 
  handleLoading,
  setStepData,
  setStepGuide
} = buildSlice.actions;

export default buildSlice.reducer;
