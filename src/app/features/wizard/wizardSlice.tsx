import { createSlice } from '@reduxjs/toolkit'

interface FormSubStep {
  slug: string;
  required: boolean;
}

interface FormStep {
  id: number;
  attributes: {
    title: string
    slug: string;
    subSteps: FormSubStep[];
  }
}

export type Wizard = {
  language: string;
  isVerified: boolean;
  isFormValid: boolean;
  isRevision: boolean;
  isRevised: boolean;
  documentId: string;
  formSteps: FormStep[];
  formStep: string;
  currentStep: string;
  hasPermission: boolean;
  hasType: boolean;
  workflowId: string | boolean;
  workflow: any;
  journal: any;
  user: any;
  screeningDetails: any[];
  typesList: any[];
}

const initialState: Wizard = {
  language: 'en',
  isVerified: false,
  isFormValid: false,
  isRevision: false,
  isRevised: false,
  documentId: '',
  formSteps: [],
  formStep: process.env.DEFAULT_STEP || '',
  currentStep: '',
  hasPermission: true,
  hasType: false,
  workflowId: false,
  workflow: {},
  journal: {},
  user: {},
  screeningDetails: [],
  typesList: [],
};

const updateHashInUrl = ( url: string, hash: string ): string => {
  const urlObj = new URL( url );
  urlObj.hash = hash;

  return urlObj.toString();
}

export const wizardSlice: any = createSlice({
  name: 'submission',
  initialState: initialState,
  reducers: {
    loadStep: ( state, action ) => {
      if ( typeof action.payload === 'object' ) {
        state.formStep = action.payload.currentStep;
        state.currentStep = action.payload.currentStep;
        state.isVerified = false;
        state.isFormValid = false;
      } else {
        state.formStep = action.payload;
        state.currentStep = action.payload;
        state.isVerified = false;
        state.isFormValid = false;
      }
    },
    prevStep: ( state ) => {
      const currentStepIndex = 
        state.formSteps.findIndex( 
          ( item: any ) => item.attributes.slug.includes( state.formStep )
        );
      if ( currentStepIndex - 1 >= 0 ) {
        const prevFormStep = state.formSteps[currentStepIndex - 1]['attributes']['slug'];
        const newUrl = updateHashInUrl(window.location.href, prevFormStep);
        window.history.pushState({}, '', newUrl);
        state.formStep = prevFormStep;
        state.currentStep = prevFormStep;
        state.isVerified = false;
      }
    },
    nextStep: ( state, action ) => {
      const currentStepIndex = state.formSteps.findIndex((item: any) =>
        item.attributes.slug.includes(state.formStep)
      );
      const isLastStep = currentStepIndex === state.formSteps.length - 1;
      if ( !isLastStep && action.payload ) {
        const nextFormStep = state.formSteps[currentStepIndex + 1]['attributes']['slug'];
        const newUrl = updateHashInUrl(window.location.href, nextFormStep);
        window.history.pushState({}, '', newUrl);
        state.formStep = nextFormStep;
        state.currentStep = nextFormStep;
        state.isVerified = false;
        state.isFormValid = false;
      }
      state.isVerified = false;
      state.isFormValid = false;
    },
    finishSubmission: ( state, action ) => {
      setTimeout(() => {
        window.location.href = action.payload.data.link;
      }, 5000);
    },
    formValidator: ( state, action ) => {
      return {
        ...state,
        isFormValid: action.payload
      }
    },
    handleIsVerified: ( state ) => {
      return {
        ...state,
        isVerified: true
      }
    },
    setCurrentStep: ( state, action ) => {
      state.currentStep = action.payload;
      state.formStep = action.payload;
    },
    setHasTypeDetermined: ( state ) => {
      state.hasType = true;
    },
    setFormStep: ( state, action ) => {
      state.formStep = action.payload;
    },
    setJournal: ( state, action ) => {
      state.journal = action.payload;
    },
    setLanguage: ( state, action ) => {
      state.language = action.payload;
    },
    setNewWorkflow: ( state, action ) => {
      state.workflowId = action.payload?.id;
      window.location.href = `${ process.env.REDIRECT_URL !== undefined 
        ? process.env.REDIRECT_URL 
        : process.env.SUBMISSION_API_URL }/${ action.payload?.id }`;
    },
    setSubmissionSteps: ( state, action ) => {
      let formSteps = action.payload;
      const footnotes = [
        'authors_contribution', 
        'conflict_of_interests', 
        'funding_support'
      ];
      const ethicalStatements = [
        'clinical_trial_registration_code', 
        'ethical_approval', 
        'informed_consent', 
        'data_availability'
      ];
      const footnotesStep = formSteps?.filter( 
        ( step: any ) => footnotes.includes( step.attributes?.slug ) 
      );
      const ethicalStatementsStep = formSteps?.filter( 
        ( step: any ) => ethicalStatements.includes( step.attributes?.slug ) 
      );
      const duplicateIndicator = {
        footnotes: false,
        ethicalStatements: false
      };
      const newSteps = formSteps.flatMap( ( step: any ) => {
        if ( footnotes.includes( step.attributes?.slug ) ) {
          if ( !duplicateIndicator.footnotes ) {
            duplicateIndicator.footnotes = true;
            return [{
              attributes: {
                slug: 'footnotes',
                required: footnotesStep.some( ( item: any ) => item.attributes?.requirement ),
                subSteps: footnotesStep.map( 
                  ( item: any ) => { 
                    return { 
                      slug: item.attributes?.slug, 
                      required: item.attributes?.requirement || false 
                    } 
                  } 
                )
              }
            }];
          } else {
            return [];
          }
        } else if ( ethicalStatements.includes( step.attributes?.slug ) ) {
          if ( !duplicateIndicator.ethicalStatements ) {
            duplicateIndicator.ethicalStatements = true;
            return [{
              attributes: {
                slug: 'ethical_statements',
                required: ethicalStatementsStep.some( 
                  ( item: any ) => item.attributes?.requirement 
                ),
                subSteps: ethicalStatementsStep.map( 
                  ( item: any ) => { 
                    return { 
                      slug: item.attributes?.slug, 
                      required: item.attributes?.requirement || false 
                    } 
                  } 
                )
              }
            }];
          } else {
            return [];
          }
        } else {
          return [{
            attributes: {
              slug: step.attributes?.slug,
              required: step.attributes?.requirement,
              subSteps: []
            }
          }];
        }
      });
      state.formSteps = newSteps;
    },
    setTypes: ( state, action ) => {
      state.typesList = action.payload.data
    },
    setUser: ( state, action ) => {
      state.user = action.payload.data
    },
    setWorkflow: ( state, action ) => {
      if ( action.payload.data !== undefined ) {
        const workflow = action.payload.data?.attributes;
        state.workflow = workflow;
        if ( 
          workflow?.storage.hasOwnProperty('revision') && 
          workflow.storage.revision !== null && 
          parseInt( workflow.storage.revision ) > 0 
        ) {
          state.isRevision = true;
        }
        if ( workflow?.hasOwnProperty('document_id') && 
          workflow.document_id !== null && 
          workflow.document_id !== 0 
        ) {
          state.isRevised = true;
          state.documentId = workflow.document_id;
        }
        if ( state.isRevision || state.isRevised ) {
          state.formSteps.push( 
            { 
              id: 0, 
              attributes: { 
                title: 'Revision Message', 
                slug: 'revision_message', 
                subSteps: []
              } 
            } 
          );
          state.formStep === '' && ( state.formStep = 'revision_message' );
        }
      } else {
        if ( action.payload === 404 ) {
          state.hasPermission = false;
        }
      }
    },
    setWorkflowId: ( state, action ) => {
      state.workflowId = action.payload;
    }
  }
});

export const { 
  loadStep, 
  prevStep, 
  nextStep,
  finishSubmission,
  formValidator,
  handleIsVerified,
  setCurrentStep,
  setFormStep,
  setHasTypeDetermined,
  setJournal,
  setLanguage,
  setNewWorkflow,
  setSubmissionSteps,
  setTypes,
  setUser,
  setWorkflow,
  setWorkflowId 
} = wizardSlice.actions;

export default wizardSlice.reducer;
