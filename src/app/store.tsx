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
import financialDisclosureReducer from './features/submission/financialDisclosureSlice'
import abstractReducer from './features/submission/abstractSlice'
import twitterReducer from './features/submission/twitterSlice'
import reviewersReducer from './features/submission/reviewersSlice'
import buildReducer from '@/app/features/submission/buildSlice'
import zeroReducer from '@/app/features/submission/zeroSlice'
import dialogReducer from '@/app/features/dialog/dialogSlice'
import snackbarReducer from '@/app/features/snackbar/snackbarSlice'
import modalSnackbarReducer from '@/app/features/snackbar/modalSnackbarSlice'
import footnotesReducer from '@/app/features/submission/footnotesSlice'
import permissionsReducer from '@/app/features/submission/permissionsSlice'

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
    financialDisclosureSlice: financialDisclosureReducer,
    abstractSlice: abstractReducer,
    twitterSlice: twitterReducer,
    reviewersSlice: reviewersReducer,
    buildSlice: buildReducer,
    zeroSlice: zeroReducer,
    dialogSlice: dialogReducer,
    snackbarSlice: snackbarReducer,
    modalSnackbarSlice: modalSnackbarReducer,
    footnotesSlice: footnotesReducer,
    permissionsSlice: permissionsReducer
  }
});