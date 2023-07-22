import { createSlice } from '@reduxjs/toolkit'
import { getSubmissionSteps, getWorkflow } from '@/app/api/client'

export const wizardSlice = createSlice({
  name: 'submission',
  initialState: {
    isLoading: false,
    isVerified: false,
    isFormValid: false,
    formStep: 'agreement',
    formSteps: [],
    workflow: {}
  },
  reducers: {
    loadStep: ( state, action ) => {
      return {
        ...state,
        formStep: action.payload 
      }
    },
    prevStep: ( state ) => {
      const currentStepIndex = state.formSteps.findIndex( ( item: any ) => item.attributes.title.toLowerCase().includes( state.formStep ));
        // setSubmitReady(false);
        if ( currentStepIndex - 1 >= 0 ) {
            return {
              ...state,
              formStep: state.formSteps[currentStepIndex - 1].attributes.title.toLowerCase() 
            }
        }
    },
    nextStep: (state, action) => {
      const currentStepIndex = state.formSteps.findIndex((item) =>
        item.attributes.title.toLowerCase().includes(state.formStep)
      );
      const isLastStep = currentStepIndex === state.formSteps.length - 1;
      // setSubmitReady(isLastStep);
      if (!isLastStep && action.payload) {
        return {
          ...state,
          formStep: state.formSteps[currentStepIndex + 1].attributes.title.toLowerCase(),
          isVerified: false
        };
      }
      return {
        ...state,
        isVerified: true
      };
    },
    formValidator: ( state, action ) => {
      return {
        ...state,
        isFormValid: action.payload
      }
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getSubmissionSteps.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getSubmissionSteps.fulfilled, ( state, action ) => {
        const activeSteps = action.payload.data.filter(
          (item: any) => item.attributes.status === 'active'
        );
        if ( activeSteps !== undefined ) {
          state.formSteps = activeSteps;
          state.formStep = activeSteps[0]?.attributes.title.toLowerCase() || '';
        }
      })
      .addCase( getSubmissionSteps.rejected, ( state ) => {
        // state.error = action.error.message;
      }).addCase( getWorkflow.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getWorkflow.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.workflow = action.payload.data.attributes;
      });
  },
});

export const { loadStep, prevStep, nextStep, formValidator } = wizardSlice.actions;

export const wizardState = ( state: any ) => state.wizardSlice;

export default wizardSlice.reducer;
