import { createSlice } from '@reduxjs/toolkit'
import { getFinancialDisclosureStepGuide, getFinancialDisclosureStepData } from '@/app/api/financialDisclosure'

export const financialDisclosureSlice = createSlice({
  name: 'financial-disclosure',
  initialState: {
    isLoading: false,
    isVisited: false,
    stepGuide: {},
    value: {
        text: ''
    }
  },
  reducers: {
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          text: action.payload,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getFinancialDisclosureStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getFinancialDisclosureStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getFinancialDisclosureStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getFinancialDisclosureStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getFinancialDisclosureStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput, handleLoading } = financialDisclosureSlice.actions;

export const stepState = ( state: any ) => state.financialDisclosureSlice;

export default financialDisclosureSlice.reducer;
