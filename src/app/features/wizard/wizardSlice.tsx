import { createSlice } from '@reduxjs/toolkit'
import { buildNewWorkflow, getSubmissionSteps, getWorkflow } from '@/app/api/client'

let baseUrl, currentUrl, workflowId = '';
if (typeof window !== 'undefined') {
  currentUrl = new URL( window.location.href );
  workflowId = currentUrl.pathname.split('/').pop() || '';
  baseUrl = `${ window.location.protocol }//${  window.location.hostname}`;
}

interface FormSteps {
  id: number,
  attributes: {
    title: string,
    slug: string
  }
}

export const wizardSlice = createSlice({
  name: 'submission',
  initialState: {
    baseUrl: baseUrl,
    isLoading: false,
    isVerified: false,
    isFormValid: false,
    baseDocId: '',
    revision: '',
    formSteps: [] as FormSteps[],
    formStep: 'agreement',
    workflowId: workflowId || 365,
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
      const currentStepIndex = state.formSteps.findIndex( ( item: any ) => item.attributes.slug.includes( state.formStep ));
      if ( currentStepIndex - 1 >= 0 ) {
          return {
            ...state,
            formStep: state.formSteps[currentStepIndex - 1]['attributes']['slug']
          }
      }
    },
    nextStep: ( state, action ) => {
      const currentStepIndex = state.formSteps.findIndex((item: any) =>
        item.attributes.slug.includes(state.formStep)
      );
      const isLastStep = currentStepIndex === state.formSteps.length - 1;
      if (!isLastStep && action.payload) {
        return {
          ...state,
          formStep: state.formSteps[currentStepIndex + 1]['attributes']['slug'],
          isVerified: false,
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
      .addCase( getWorkflow.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getWorkflow.fulfilled, ( state, action ) => {
        state.isLoading = false;
        const workflow = action.payload.data?.attributes;
        state.workflow = workflow;
        if ( workflow?.storage?.hasOwnProperty('base_doc_id') ) {
          state.baseDocId = workflow.storage.base_doc_id;
          state.revision = workflow.storage.revision;
          state.formSteps.push( { id: 0, attributes: { title: 'Revision Message', slug: 'revision_message'} } );
          state.formStep = 'revision_message';
        }
      })
      .addCase( getSubmissionSteps.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getSubmissionSteps.fulfilled, ( state, action ) => {
        const activeSteps = action.payload.data?.filter(
          (item: any) => item.attributes.status === 'active'
        );
        if ( activeSteps !== undefined ) {
          state.formSteps = [
            ...state.formSteps,
            ...activeSteps.map((step: any) => ({ attributes: { slug: step.attributes.slug } })),
          ];
          state.formStep = state.formSteps[0]?.attributes.slug || '';
        }
      })
      .addCase( getSubmissionSteps.rejected, ( state ) => {
        // state.error = action.error.message;
      }).addCase( buildNewWorkflow.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( buildNewWorkflow.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.workflowId = action.payload?.id;
        window.location.href = `${ state.baseUrl }/en/submssion/workflow/${ action.payload?.id }`;
      });
  },
});

export const { loadStep, prevStep, nextStep, formValidator } = wizardSlice.actions;

export const wizardState = ( state: any ) => state.wizardSlice;

export default wizardSlice.reducer;
