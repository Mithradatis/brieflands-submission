import ReactHtmlParser from 'react-html-parser'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { handleDialogClose } from '@features/dialog/dialogSlice'
import useHandleOperation from '@/app/services/dialog'
import {
    Box,
    Button,
    Dialog,
    Stack,
    Typography
} from '@mui/material'

const DialogComponent = () => {
    const { handleOperation } = useHandleOperation();
    const dispatch: any = useAppDispatch();
    const dialog: any = useAppSelector((state: any) => state.dialog);

    const handleClose = (event: any, reason: string) => {
        if (reason !== 'backdropClick') {
            dispatch(handleDialogClose())
        }
    }

    return (
        <Dialog
            open={dialog.isOpen}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            sx={{ backdropFilter: 'blur(5px)' }}
        >
            <Box p={2} sx={{ minWidth: 400 }}>
                <Typography
                    mb={2}
                    component="h2"
                    id="close-modal-title"
                    variant="h4"
                    color="inherit"
                    fontWeight="lg"
                >
                    {dialog.dialogTitle}
                </Typography>
                <Typography>
                    {ReactHtmlParser(dialog.dialogContent.content)}
                </Typography>
                <Stack direction="row" justifyContent="flex-end">
                    <Box>
                        <Button onClick={() => dispatch(handleDialogClose())}>
                            {dialog.denyPhrase || 'No'}
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => handleOperation(dialog.dialogAction)}
                            autoFocus>
                            {dialog.approvePhrase || 'Yes'}
                        </Button>
                    </Box>
                </Stack>
                
            </Box>
        </Dialog>
    )
}

export default DialogComponent;