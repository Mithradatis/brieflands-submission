import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import { handleSnackbarClose } from '@/lib/features/snackbar/snackbarSlice'

const FlashMessage = ( prop: any ) => {
    const dispatch: any = useDispatch();
    const snackbar = useSelector( ( state: any ) => state.snackbarSlice );

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