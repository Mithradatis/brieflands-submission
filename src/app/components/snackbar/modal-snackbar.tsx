import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import Slide, { SlideProps } from '@mui/material/Slide'
import Grow, { GrowProps } from '@mui/material/Grow'
import { TransitionProps } from '@mui/material/transitions'
import { modalSnackbarState, handleModalSnackbarClose } from '@/app/features/snackbar/modalSnackbarSlice'

const ModalFlashMessage = ( prop: any ) => {
    const dispatch: any = useDispatch();
    const snackbar = useSelector( modalSnackbarState );
    const SlideTransition = ( props: SlideProps ) => {
        return <Slide {...props} direction="up" />;
    }
    const GrowTransition = ( props: GrowProps ) => {
        return <Grow {...props} />;
    }

    return (
        <Snackbar
            className="modal-flash-message"
            open={ snackbar.isOpen }
            anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }}
            onClose={ () => dispatch( handleModalSnackbarClose() ) }
            autoHideDuration={5000}
            // TransitionComponent={ snackbar.transition }
            // key={ snackbar.transition.name }
        >
            <Alert onClose={ () => dispatch( handleModalSnackbarClose() ) } severity={ snackbar.severity }>
                { snackbar.message }
            </Alert>
        </Snackbar>
    )
}

export default ModalFlashMessage;