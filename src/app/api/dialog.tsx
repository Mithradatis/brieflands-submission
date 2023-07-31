import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleDialogClose } from '@/app/features/dialog/dialogSlice'
import { deleteAuthor } from '@/app/api/author'
import { deleteReviewer } from '@/app/api/reviewers'
import { deleteFile } from '@/app/api/files'

export const handleOperation = createAsyncThunk(
    'dialog/handleOperation', 
    async ( operation: any, { getState, dispatch } ) => {
        const state: any = getState();
        const dialog = state.dialogSlice;
        switch ( operation ) {
            case 'delete-author': 
                dispatch( deleteAuthor( { url: dialog.action, author: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
            case 'delete-reviewer': 
                dispatch( deleteReviewer( { url: dialog.action, reviewer: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
            case 'delete-file': 
                dispatch( deleteFile( { url: dialog.action, uuid: dialog.data } ) );
                dispatch( handleDialogClose() );
            break;
        }

        return null;
    }
);