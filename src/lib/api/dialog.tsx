import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleDialogClose } from '@/lib/features/dialog/dialogSlice'
import { getWorkflow, getSubmissionSteps } from '@/lib/api/client'
import { updateTypesStepData } from '@/lib/api/steps/types'
import { deleteAuthor } from '@/lib/api/steps/authors'
import { deleteReviewer } from '@/lib/api/steps/reviewers'
import { deleteFile, reuseFile } from '@/lib/api/steps/files'
import { finishSubmission } from './client'
import { nextStep, setFormStep } from '@/lib/features/wizard/wizardSlice'

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
                    await dispatch( setFormStep( 'types' ) );
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