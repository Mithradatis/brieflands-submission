import { configureStore } from '@reduxjs/toolkit'
import submissionReducer from '@/app/features/submission/submissionSlice'
import modalReducer from '@/app/features/modal/modalSlice'
import addAuthorModalReducer from '@/app/features/modal/addAuthorModalSlice'
import wizardReducer from '@/app/features/wizard/wizardSlice'
import keywordsReducer from '@/app/features/submission/keywordsSlice'

export const store = configureStore({
  reducer: {
    submissionSlice: submissionReducer,
    modalSlice: modalReducer,
    addAuthorModalSlice: addAuthorModalReducer,
    wizardSlice: wizardReducer,
    keywordsSlice: keywordsReducer
  },
});