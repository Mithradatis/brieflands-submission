import { useAppDispatch, useAppSelector } from '@/store/store'
import { Alert, Snackbar } from '@mui/material'
import { handleSnackbarClose } from '@features/snackbar/snackbarSlice'

const FlashMessage = ( prop: any ) => {
    const dispatch: any = useAppDispatch();
    const snackbar = useAppSelector( ( state: any ) => state.snackbar );

    return (
        <Snackbar
            open={ snackbar.isOpen }
            onClose={ () => dispatch( handleSnackbarClose() ) }
            autoHideDuration={5000}
        >
            <Alert severity={ snackbar.severity }>
                { snackbar.message }
            </Alert>
        </Snackbar>
    )
}

export default FlashMessage;