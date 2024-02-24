import { configureStore } from '@reduxjs/toolkit'
import wizardReducer from '@/lib/features/wizard/wizardSlice'
import modalReducer from '@/lib/features/modal/modalSlice'
import addAuthorModalReducer from '@/lib/features/modal/addAuthorModalSlice'
import addReviewerModalReducer from '@/lib/features/modal/addReviewerModalSlice'
import agreementReducer from '@/lib/features/submission/steps/agreement/agreementSlice'
import typesReducer from '@/lib/features/submission/steps/types/typesSlice'
import sectionReducer from '@/lib/features/submission/steps/section/sectionSlice'
import authorsReducer from '@/lib/features/submission/steps/authors/authorsSlice'
import filesReducer from '@/lib/features/submission/steps/files/filesSlice'
import keywordsReducer from '@/lib/features/submission/steps/keywords/keywordsSlice'
import classificationsReducer from '@/lib/features/submission/steps/classifications/classificationsSlice'
import commentsReducer from '@/lib/features/submission/steps/comments/commentsSlice'
import editorReducer from '@/lib/features/submission/steps/editor/editorSlice'
import regionReducer from '@/lib/features/submission/steps/region/regionSlice'
import financialDisclosureReducer from './lib/features/submission/steps/financial-disclosure/financialDisclosureSlice'
import abstractReducer from '@/lib/features/submission/steps/abstract/abstractSlice'
import twitterReducer from '@/lib/features/submission/steps/twitter/twitterSlice'
import reviewersReducer from '@/lib/features/submission/steps/reviewers/reviewersSlice'
import buildReducer from '@/lib/features/submission/steps/build/buildSlice'
import zeroReducer from '@/lib/features/submission/steps/zero/zeroSlice'
import dialogReducer from '@/lib/features/dialog/dialogSlice'
import snackbarReducer from '@/lib/features/snackbar/snackbarSlice'
import modalSnackbarReducer from '@/lib/features/snackbar/modalSnackbarSlice'
import footnotesReducer from '@/lib/features/submission/steps/footnotes/footnotesSlice'
import ethicalStatementsReducer from '@/lib/features/submission/steps/ethical-statements/ethicalStatementsSlice'

export const store = configureStore({
  reducer: {
    wizardSlice: wizardReducer,
    modalSlice: modalReducer,
    addAuthorModalSlice: addAuthorModalReducer,
    addReviewerModalSlice: addReviewerModalReducer,
    agreementSlice: agreementReducer,
    typesSlice: typesReducer,
    sectionSlice: sectionReducer,
    authorsSlice: authorsReducer,
    filesSlice: filesReducer,
    keywordsSlice: keywordsReducer,
    classificationsSlice: classificationsReducer,
    commentsSlice: commentsReducer,
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
    ethicalStatementsSlice: ethicalStatementsReducer
  }
});