import { createSlice } from '@reduxjs/toolkit'
import { getEthicalApprovalStepGuide, getEthicalApprovalStepData } from '@/app/api/ethicalApproval'

export const ethicalApprovalSlice = createSlice({
  name: 'ethicalApproval',
  initialState: {
    isLoading: false,
    isFormValid: true,
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
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getEthicalApprovalStepGuide.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getEthicalApprovalStepGuide.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        if ( Object.keys(action.payload).length > 0 ) {
          state.stepGuide = action.payload.data.value;
        }
      })
      .addCase(getEthicalApprovalStepData.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getEthicalApprovalStepData.fulfilled, (state, action: any) => {
        const { data } = action.payload;
        return {
          ...state,
          isLoading: false,
          value: data.step_data,
        };
      })
      .addCase( getEthicalApprovalStepData.rejected, ( state ) => {
        // state.error = action.error.message;
      });
  },
});

export const { handleInput } = ethicalApprovalSlice.actions;

export const stepState = ( state: any ) => state.ethicalApprovalSlice;

export default ethicalApprovalSlice.reducer;
