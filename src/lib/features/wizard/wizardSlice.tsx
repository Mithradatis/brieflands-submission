import { createSlice } from '@reduxjs/toolkit'
import {
  buildNewWorkflow, 
  getJournal, 
  getUser, 
  getSubmissionSteps, 
  getWorkflow, 
  finishSubmission, 
  getScreening 
} from '@/lib/api/client'
import { getTypes } from '@/lib/api/steps/types'

let currentUrl, workflowId, activeTab = '';
if ( typeof window !== 'undefined' ) {
  currentUrl = new URL( window.location.href );
  activeTab = currentUrl.hash ? currentUrl.hash.substring(1) : process.env.DEFAULT_STEP || '';
  let pathname = currentUrl.pathname;
  if ( pathname.endsWith('/') ) {
    pathname = pathname.slice(0, -1);
  }
  const pathParts = pathname.split('/');
  const poppedPart = pathParts.pop();
  workflowId = poppedPart !== 'undefined' && poppedPart !== 'workflow' ? poppedPart : '';
}

interface FormSubStep {
  slug: string;
  required: boolean;
}

interface FormStep {
  id: number;
  attributes: {
    title: string;
    slug: string;
    subSteps: FormSubStep[];
  }
}

interface WizardState {
  language: string;
  isLoading: boolean;
  isVerified: boolean;
  isFormValid: boolean;
  isInitialized: boolean;
  isRevision: boolean;
  isRevised: boolean;
  documentId: string;
  formSteps: FormStep[];
  formStep: string;
  currentStep: string;
  hasPermission: boolean;
  hasType: boolean;
  workflowId: string;
  workflow: any;
  journal: any;
  user: any;
  screeningDetails: any[];
  typesList: any[];
}

const initialState: WizardState = {
  language: 'en',
  isLoading: true,
  isVerified: false,
  isFormValid: false,
  isInitialized: false,
  isRevision: false,
  isRevised: false,
  documentId: '',
  formSteps: [],
  formStep: activeTab,
  currentStep: '',
  hasPermission: true,
  hasType: false,
  workflowId: workflowId || '',
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
        state.isVerified = false;
        state.isFormValid = action.payload.isRefereshed;
      } else {
        state.formStep = action.payload;
        state.isVerified = false;
        state.isFormValid = false;
      }
    },
    prevStep: ( state ) => {
      const currentStepIndex = state.formSteps.findIndex( ( item: any ) => item.attributes.slug.includes( state.formStep ));
      if ( currentStepIndex - 1 >= 0 ) {
        const prevFormStep = state.formSteps[currentStepIndex - 1]['attributes']['slug'];
        const newUrl = updateHashInUrl(window.location.href, prevFormStep);
        window.history.pushState({}, '', newUrl);
        state.formStep = prevFormStep;
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
        state.isVerified = false;
        state.isFormValid = false;
      }
      state.isVerified = false;
      state.isFormValid = false;
    },
    formValidator: ( state, action ) => {
      state.isFormValid = action.payload;
    },
    handleIsVerified: ( state ) => {
      state.isVerified = true;
    },
    setFormStep: ( state, action ) => {
      state.formStep = action.payload;
    },
    setIsInitialized: ( state ) => {
      state.isInitialized = true;
    },
    setLanguage: ( state, action ) => {
      state.language = action.payload;
    },
    setWorkflowId: ( state, action ) => {
      state.workflowId = action.payload;
    }
  },
  extraReducers( builder ) {
    builder
      .addCase( getWorkflow.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( getWorkflow.fulfilled, ( state, action ) => {
        state.isLoading = false;
        if ( action.payload.data !== undefined ) {
          const workflow = action.payload.data?.attributes;
          state.workflow = workflow;
          if ( workflow?.storage.hasOwnProperty('revision') && workflow.storage.revision !== null && parseInt( workflow.storage.revision ) > 0 ) {
            state.isRevision = true;
          }
          if ( workflow?.hasOwnProperty('document_id') && workflow.document_id !== null && workflow.document_id !== 0 ) {
            state.isRevised = true;
            state.documentId = workflow.document_id;
          }
          if ( state.isRevision || state.isRevised ) {
            state.formSteps.push( { id: 0, attributes: { title: 'Revision Message', slug: 'revision_message', subSteps: []} } );
            state.currentStep === '' && ( state.formStep = 'revision_message' );
          }
        } else {
          if ( action.payload === 404 ) {
            state.hasPermission = false;
          }
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
        state.isLoading = false;
        state.formSteps = state.formSteps[0]?.attributes?.slug === 'revision_message' ? [{ id: 0, attributes: { title: 'Revision Message',  slug: 'revision_message', subSteps: [] } }] : [];
        const activeSteps = action.payload.data;
        const footnotes = ['authors_contribution', 'conflict_of_interests', 'funding_support'];
        const ethicalStatements = ['clinical_trial_registration_code', 'ethical_approval', 'informed_consent', 'data_availability'];
        const footnotesStep = activeSteps?.filter( ( step: any ) => footnotes.includes( step.attributes?.slug ) );
        const ethicalStatementsStep = activeSteps?.filter( ( step: any ) => ethicalStatements.includes( step.attributes?.slug ) );
        const duplicateIndicator = {
          footnotes: false,
          ethicalStatements: false
        };
        if ( activeSteps !== undefined ) {
          const newSteps = activeSteps.flatMap( ( step: any ) => {
            if ( footnotes.includes( step.attributes?.slug ) ) {
              if ( !duplicateIndicator.footnotes ) {
                duplicateIndicator.footnotes = true;
                return [{
                  attributes: {
                    slug: 'footnotes',
                    required: footnotesStep.some( ( item: any ) => item.attributes?.requirement ),
                    subSteps: footnotesStep.map( ( item: any ) => { return { slug: item.attributes?.slug, required: item.attributes?.requirement || false } } )
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
                    required: ethicalStatementsStep.some( ( item: any ) => item.attributes?.requirement ),
                    subSteps: ethicalStatementsStep.map( ( item: any ) => { return { slug: item.attributes?.slug, required: item.attributes?.requirement || false } } )
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
        
          state.formSteps = [...state.formSteps, ...newSteps];
        }
      }).addCase( buildNewWorkflow.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase( buildNewWorkflow.fulfilled, ( state, action ) => {
        state.isLoading = false;
        state.workflowId = action.payload?.id;
        window.location.href = `${ process.env.REDIRECT_URL !== undefined ? process.env.REDIRECT_URL : process.env.SUBMISSION_API_URL }/${ action.payload?.id }`;
      }).addCase(getTypes.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getTypes.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        state.typesList = action.payload.data;
      }).addCase(finishSubmission.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(finishSubmission.fulfilled, ( state, action: any ) => {
        setTimeout(() => {
          window.location.href = action.payload.data.link;
        }, 5000);
      }).addCase(getScreening.pending, ( state ) => {
        state.isLoading = true;
      })
      .addCase(getScreening.fulfilled, ( state, action: any ) => {
        state.isLoading = false;
        const screeningData = action.payload.data;
        const screeningRelationships = action.payload.included;
        screeningData?.map( ( screenedStep: any, index: number ) => {
          screeningData[index].attributes.step_slug = screeningRelationships.find( ( step: any ) => parseInt( step.id ) === parseInt( screenedStep.attributes.step_id ) ).attributes.slug;
        });
        state.screeningDetails = screeningData; 
      });
  },
});

export const { 
  loadStep, 
  prevStep, 
  nextStep, 
  formValidator,
  handleIsVerified, 
  setFormStep,
  setIsInitialized,
  setLanguage,
  setWorkflowId 
} = wizardSlice.actions;

export default wizardSlice.reducer;
