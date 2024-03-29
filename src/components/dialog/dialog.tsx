import ReactHtmlParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { handleDialogClose } from '@/lib/features/dialog/dialogSlice'
import { handleOperation } from '@/lib/api/dialog'
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    useMediaQuery 
} from '@mui/material'

const DialogComponent = () => {
    const dispatch: any = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery( theme.breakpoints.down('md') );
    const dialog: any = useSelector( ( state: any ) => state.dialogSlice );

    const handleClose = ( event: any, reason: string ) => {
        if ( reason !== 'backdropClick' ) {
            dispatch( handleDialogClose() )
        }
    }

    return (
        <Dialog
            fullWidth={true}
            fullScreen={fullScreen}
            open={ dialog.isOpen }
            onClose={ handleClose }
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                { dialog.dialogTitle }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    { ReactHtmlParser( dialog.dialogContent.content ) }
                </DialogContentText>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={ () => dispatch( handleDialogClose() ) }>
                    { dialog.denyPhrase || 'No' }
                </Button>
                <Button
                    className="btn btn-primary" 
                    onClick={ () => dispatch( handleOperation( dialog.dialogAction ) ) } 
                    autoFocus>
                    { dialog.approvePhrase || 'Yes' }
                </Button>
            </DialogActions>
        </Dialog>
    ) 
}

export default DialogComponent;