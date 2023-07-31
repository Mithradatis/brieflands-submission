import { useDispatch, useSelector } from 'react-redux'
import Snackbar from '@mui/material/Snackbar'
import Slide, { SlideProps } from '@mui/material/Slide'
import Grow, { GrowProps } from '@mui/material/Grow'
import { TransitionProps } from '@mui/material/transitions'
import { snackbarState, handleSnackbarClose } from '@/app/features/snackbar/snackbarSlice'

const FlashMessage = ( prop: any ) => {
    const { open, message } = prop;
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
            open={ open }
            onClose={ () => dispatch( handleSnackbarClose() ) }
            // TransitionComponent={ snackbar.transition }
            message={ message }
            // key={ snackbar.transition.name }
        />
    )
}

export default FlashMessage;