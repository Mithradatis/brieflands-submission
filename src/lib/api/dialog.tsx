import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleDialogClose } from '@features/dialog/dialogSlice'
import { getWorkflow, getSubmissionSteps, updateStepData } from '@api/client'
import { deleteAuthor } from '@api/steps/authors'
import { deleteReviewer } from '@api/steps/reviewers'
import { deleteFile, reuseFile } from '@api/steps/files'
import { finishSubmission } from '@api/client'
import { nextStep, setFormStep } from '@features/wizard/wizardSlice'

export const handleOperation = createAsyncThunk(
    'dialog/handleOperation', 
    async ( operation: any, { getState, dispatch } ) => {
        const state: any = getState();
        const dialog = state.dialog;
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
                    await dispatch(updateStepData( { url: dialog.actions.updateTypesStepData, step: 'types' } ));
                    await dispatch(getWorkflow( dialog.actions.getWorkflow ));
                    await dispatch(getSubmissionSteps( dialog.actions.getSubmissionSteps ));
                    await dispatch( setFormStep( 'types' ) );
                    dispatch( nextStep( dialog.actions.currentFormStep ) );
                })();
            break;
            case 'finish-submission':
                (async () => {
                    await dispatch( finishSubmission( dialog.actions.finishWorkflow ) );
                    await dispatch( handleDialogClose() );
                })();
            break;
        }

        return null;
    }
);