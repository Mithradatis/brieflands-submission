import { createSlice } from '@reduxjs/toolkit'

const steps = [
  {id: 1, title: 'agreement', status: 'incomplete', active: false},
  {id: 2, title: 'types', status: 'incomplete', active: false},
  {id: 3, title: 'section', status: 'incomplete', active: false},
  {id: 4, title: 'authors', status: 'incomplete', active: true},
  {id: 5, title: 'keywords', status: 'incomplete', active: false},
  {id: 6, title: 'classifications', status: 'incomplete', active: false},
  {id: 7, title: 'abstract', status: 'incomplete', active: false},
  {id: 8, title: 'editor', status: 'incomplete', active: false},
  {id: 9, title: 'reviewers', status: 'incomplete', active: false},
  {id: 10, title: 'files', status: 'incomplete', active: false},
];

export const wizardSlice = createSlice({
  name: 'submission',
  initialState: {
    formStep: steps.filter( item => item.active )[0].title,
    formSteps: steps
  },
  reducers: {
    loadStep: ( state, action ) => {
      return {
        ...state,
        formStep: action.payload 
      }
    },
    prevStep: ( state ) => {
      const currentStepIndex = steps.findIndex( item => item.title.includes( state.formStep ));
        // setSubmitReady(false);
        if ( currentStepIndex - 1 >= 0 ) {
            return {
              ...state,
              formStep: steps[currentStepIndex - 1].title 
            }
        }
    },
    nextStep: ( state, action ) => {
      const currentStepIndex = steps.findIndex( item => item.title.includes( state.formStep ));
      const isLastStep = currentStepIndex === steps.length - 1;
      if (!isLastStep) {
          if ( !action.payload ) {
              return;
          }
          // setSubmitReady(isLastStep);
          return {
            ...state,
            formStep: steps[currentStepIndex + 1].title 
          }
      }
    },
  },
});

export const { loadStep, prevStep, nextStep } = wizardSlice.actions;

export const wizardState = ( state: any ) => state.wizardSlice;

export default wizardSlice.reducer;
