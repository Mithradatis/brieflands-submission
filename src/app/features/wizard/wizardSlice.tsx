import { createSlice } from '@reduxjs/toolkit'
import { buildNewWorkflow, getJournal, getUser, getSubmissionSteps, getWorkflow, finishSubmission } from '@/app/api/client'
import { getDocumentTypes } from '@/app/api/types'

let baseUrl, currentUrl, workflowId, activeTab = '';
if ( typeof window !== 'undefined' ) {
  currentUrl = new URL( window.location.href );
  activeTab = currentUrl.hash ? currentUrl.hash.substring(1) : '';
  let pathname = currentUrl.pathname;
  if ( pathname.endsWith('/') ) {
    pathname = pathname.slice(0, -1);
  }
  const pathParts = pathname.split('/');
  const poppedPart = pathParts.pop();
  workflowId = poppedPart !== undefined && poppedPart !== 'workflow' ? poppedPart : '';
  baseUrl = `${window.location.protocol}//${window.location.hostname}`;
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
    isLoading: true,
    isVerified: false,
    isFormValid: false,
    documentId: '',
    formSteps: [] as FormSteps[],
    formStep: 'agreement',
    currentStep: activeTab,
    hasDocumentType: false,
    workflowId: workflowId,
    workflow: {},
    journal: {},
    user: {},
    documentTypesList: []
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
        if ( workflow?.hasOwnProperty('document_id') && workflow.document_id !== null && workflow.document_id !== 0 ) {
          state.documentId = workflow.document_id;
          state.formSteps.push( { id: 0, attributes: { title: 'Revision Message', slug: 'revision_message'} } );
          state.formStep = 'revision_message';
        }
      })
      .addCase(getJournal.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getJournal.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.journal = action.payload.data;
      })
      .addCase(getUser.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase( getSubmissionSteps.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getSubmissionSteps.fulfilled, ( state, action ) => {
        state.formSteps = state.formSteps[0]?.attributes?.slug === 'revision_message' ? [{ id: 0, attributes: { title: 'Revision Message',  slug: 'revision_message' } }] : [];
        const activeSteps = action.payload.data;
        if ( activeSteps !== undefined ) {
          state.formSteps = [
            ...state.formSteps,
            ...activeSteps.map((step: any) => ({ attributes: { slug: step.attributes.slug, required: step.attributes.requirement } })),
          ];
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
        window.location.href = `${ state.baseUrl }/en/submission/workflow/${ action.payload?.id }`;
      }).addCase(getDocumentTypes.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getDocumentTypes.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.documentTypesList = action.payload.data;
      }).addCase(finishSubmission.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(finishSubmission.fulfilled, ( state, action: any ) => {
        setTimeout(() => {
          window.location.href = action.payload.data.link;
        }, 5000);
      });
  },
});

export const { loadStep, prevStep, nextStep, formValidator } = wizardSlice.actions;

export const wizardState = ( state: any ) => state.wizardSlice;

export default wizardSlice.reducer;
