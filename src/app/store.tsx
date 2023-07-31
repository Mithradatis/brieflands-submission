import { configureStore } from '@reduxjs/toolkit'
import wizardReducer from '@/app/features/wizard/wizardSlice'
import modalReducer from '@/app/features/modal/modalSlice'
import addAuthorModalReducer from '@/app/features/modal/addAuthorModalSlice'
import addReviewerModalReducer from '@/app/features/modal/addReviewerModalSlice'
import submissionReducer from '@/app/features/submission/submissionSlice'
import agreementReducer from '@/app/features/submission/agreementSlice'
import documentTypesReducer from '@/app/features/submission/documentTypesSlice'
import documentSectionReducer from '@/app/features/submission/documentSectionSlice'
import authorReducer from '@/app/features/submission/authorSlice'
import documentFilesReducer from '@/app/features/submission/documentFilesSlice'
import keywordsReducer from '@/app/features/submission/keywordsSlice'
import classificationsReducer from '@/app/features/submission/classificationsSlice'
import commentReducer from '@/app/features/submission/commentSlice'
import editorReducer from './features/submission/editorSlice'
import regionReducer from './features/submission/regionSlice'
import authorContributionReducer from './features/submission/authorContributionSlice'
import financialDisclosureReducer from './features/submission/financialDisclosureSlice'
import fundingSupportReducer from './features/submission/fundingSupportSlice'
import clinicalTrialRegistrationCodeReducer from './features/submission/clinicalTrialRegistrationCodeSlice'
import abstractReducer from './features/submission/abstractSlice'
import ethicalApprovalReducer from './features/submission/ethicalApprovalSlice'
import twitterReducer from './features/submission/twitterSlice'
import conflictOfInterestsReducer from './features/submission/conflictOfInterestsSlice'
import informedConsentReducer from './features/submission/informedConsentSlice'
import dataReproducibilityReducer from './features/submission/dataReproducibilitySlice'
import reviewersReducer from './features/submission/reviewersSlice'
import buildReducer from './features/submission/buildSlice'
import dialogReducer from './features/dialog/dialogSlice'
import snackbarReducer from './features/snackbar/snackbarSlice'

export const store = configureStore({
  reducer: {
    wizardSlice: wizardReducer,
    modalSlice: modalReducer,
    addAuthorModalSlice: addAuthorModalReducer,
    addReviewerModalSlice: addReviewerModalReducer,
    submissionSlice: submissionReducer,
    agreementSlice: agreementReducer,
    documentTypesSlice: documentTypesReducer,
    documentSectionSlice: documentSectionReducer,
    authorSlice: authorReducer,
    documentFilesSlice: documentFilesReducer,
    keywordsSlice: keywordsReducer,
    classificationsSlice: classificationsReducer,
    commentSlice: commentReducer,
    editorSlice: editorReducer,
    regionSlice: regionReducer,
    authorContributionSlice: authorContributionReducer,
    financialDisclosureSlice: financialDisclosureReducer,
    fundingSupportSlice: fundingSupportReducer,
    clinicalTrialRegistrationCodeSlice: clinicalTrialRegistrationCodeReducer,
    abstractSlice: abstractReducer,
    ethicalApprovalSlice: ethicalApprovalReducer,
    twitterSlice: twitterReducer,
    conflictOfInterestsSlice: conflictOfInterestsReducer,
    informedConsentSlice: informedConsentReducer,
    dataReproducibilitySlice: dataReproducibilityReducer,
    reviewersSlice: reviewersReducer,
    buildSlice: buildReducer,
    dialogSlice: dialogReducer,
    snackbarSlice: snackbarReducer
  }
});