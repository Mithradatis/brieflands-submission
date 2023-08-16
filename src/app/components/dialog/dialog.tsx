import { useDispatch, useSelector } from 'react-redux'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { dialogState, handleDialogClose } from '@/app/features/dialog/dialogSlice'
import { handleOperation } from '@/app/api/dialog'
import ReactHtmlParser from 'react-html-parser'

const DialogComponent = () => {
    const dispatch: any = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery( theme.breakpoints.down('md') );
    const dialog: any = useSelector( dialogState );

    return (
        <Dialog
            fullWidth={true}
            fullScreen={fullScreen}
            open={ dialog.isOpen }
            onClose={ () => dispatch( handleDialogClose() ) }
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
            <DialogActions>
                <Button onClick={ () => dispatch( handleDialogClose() ) }>
                    No
                </Button>
                <Button onClick={ () => dispatch( handleOperation( dialog.dialogAction ) ) } autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    ) 
}

export default DialogComponent;