import { createSlice } from '@reduxjs/toolkit'
import { 
  getAgreementTerms, 
  getAgreementStepGuide, 
  getAgreementStepData, 
} from '@/lib/api/steps/agreement'

export const agreementSlice = createSlice({
  name: 'agreement',
  initialState: {
    isLoading: false,
    agreementTerms: {},
    stepGuide: {},
    value: {
      terms: false
    },
  },
  reducers: {
    handleCheckbox: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.name]: !action.payload.value,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getAgreementStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getAgreementStepGuide.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.stepGuide = action.payload.data.value;
      })
      .addCase(getAgreementTerms.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getAgreementTerms.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.agreementTerms = action.payload.data;
      })
      .addCase(getAgreementStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getAgreementStepData.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.value = action.payload.data.step_data;
      });
  },
});

export const { handleCheckbox, handleLoading } = agreementSlice.actions;

export default agreementSlice.reducer;
