import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleDialogClose } from '@/app/features/dialog/dialogSlice'
import { getWorkflow, getSubmissionSteps } from '@/app/api/client'
import { updateTypesStepData } from '@/app/api/types'
import { deleteAuthor } from '@/app/api/author'
import { deleteReviewer } from '@/app/api/reviewers'
import { deleteFile, reuseFile } from '@/app/api/files'
import { finishSubmission } from './client'
import { nextStep } from '@/app/features/wizard/wizardSlice'

export const handleOperation = createAsyncThunk(
    'dialog/handleOperation', 
    async ( operation: any, { getState, dispatch } ) => {
        const state: any = getState();
        const dialog = state.dialogSlice;
        switch ( operation ) {
            case 'delete-author': 
                dispatch( deleteAuthor( { url: dialog.actions.deleteAuthor, author: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
            case 'delete-reviewer': 
                dispatch( deleteReviewer( { url: dialog.actions.deleteReviewer, reviewer: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
            case 'delete-file': 
                dispatch( deleteFile( { url: dialog.actions.deleteFile, uuid: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
            case 'reuse-file': 
                dispatch( reuseFile( { url: dialog.actions.reuseFile, uuid: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
            case 'proceed-submission':
                dispatch( handleDialogClose() );
                (async () => {
                    await dispatch(updateTypesStepData( dialog.actions.updateTypesStepData ));
                    await dispatch(getWorkflow( dialog.actions.getWorkflow ));
                    await dispatch(getSubmissionSteps( dialog.actions.getSubmissionSteps ));
                    dispatch( nextStep( dialog.actions.currentFormStep ) );
                })();
            break;
            case 'finish-submission': 
                dispatch( finishSubmission( dialog.actions.finishWorkflow ) );
                dispatch( handleDialogClose() );
            break;
        }

        return null;
    }
);