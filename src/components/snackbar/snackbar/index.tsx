import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
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
            <Alert onClose={ () => dispatch( handleSnackbarClose() ) } severity={ snackbar.severity }>
                { snackbar.message }
            </Alert>
        </Snackbar>
    )
}

export default FlashMessage;