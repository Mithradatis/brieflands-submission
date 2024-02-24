import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import { handleModalSnackbarClose } from '@/lib/features/snackbar/modalSnackbarSlice'

const ModalFlashMessage = ( prop: any ) => {
    const dispatch: any = useDispatch();
    const snackbar = useSelector( ( state: any ) => state.modalSnackbarSlice );

    return (
        <Snackbar
            className="modal-flash-message"
            open={ snackbar.isOpen }
            anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }}
            onClose={ () => dispatch( handleModalSnackbarClose() ) }
            autoHideDuration={5000}
        >
            <Alert onClose={ () => dispatch( handleModalSnackbarClose() ) } severity={ snackbar.severity }>
                { snackbar.message }
            </Alert>
        </Snackbar>
    )
}

export default ModalFlashMessage;