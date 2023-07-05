import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'
import submissionReducer from './features/submission/submissionSlice'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

const persistedSubmissionReducer = persistReducer(persistConfig, submissionReducer);

export const store = configureStore({
  reducer: {
    submissionSlice: persistedSubmissionReducer
  },
});

export const persistor = persistStore( store );