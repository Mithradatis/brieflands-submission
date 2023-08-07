import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import Slide, { SlideProps } from '@mui/material/Slide'
import Grow, { GrowProps } from '@mui/material/Grow'
import { TransitionProps } from '@mui/material/transitions'
import { snackbarState, handleSnackbarClose } from '@/app/features/snackbar/snackbarSlice'

const FlashMessage = ( prop: any ) => {
    const dispatch: any = useDispatch();
    const snackbar = useSelector( snackbarState );
    const SlideTransition = ( props: SlideProps ) => {
        return <Slide {...props} direction="up" />;
    }
    const GrowTransition = ( props: GrowProps ) => {
        return <Grow {...props} />;
    }

    return (
        <Snackbar
            className="z-index-1050"
            open={ snackbar.isOpen }
            onClose={ () => dispatch( handleSnackbarClose() ) }
            autoHideDuration={5000}
            // TransitionComponent={ snackbar.transition }
            // key={ snackbar.transition.name }
        >
            <Alert onClose={ () => dispatch( handleSnackbarClose() ) } severity={ snackbar.severity }>
                { snackbar.message }
            </Alert>
        </Snackbar>
    )
}

export default FlashMessage;