import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { submissionApi } from '@/app/services/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import wizard from '@features/wizard/wizardSlice'
import modal from '@features/modal/modalSlice'
import dialog from '@features/dialog/dialogSlice'
import snackbar from '@features/snackbar/snackbarSlice'
import modalSnackbar from '@features/snackbar/modalSnackbarSlice'
import addAuthorModal from '@features/modal/addAuthorModalSlice'
import addReviewerModal from '@features/modal/addReviewerModalSlice'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: {
      [submissionApi.reducerPath]: submissionApi.reducer,
      wizard,
      modal,
      addAuthorModal,
      addReviewerModal,
      dialog,
      snackbar,
      modalSnackbar
    },
    middleware: ( getDefaultMiddleware: any ) =>
      getDefaultMiddleware().concat( submissionApi.middleware ),
    ...options,
  })

export const store = createStore()

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector