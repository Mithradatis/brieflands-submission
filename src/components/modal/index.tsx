import { createPortal } from 'react-dom'
import { Modal, Box, Divider, Button, Dialog, Stack, Typography } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars-2'
import ModalFlashMessage from '@/components/snackbar/snackbar-modal'

const ModalContent = (
  {
    children,
    isOpen,
    onClose,
    modalTitle,
    modalActions
  }: {
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
    modalTitle: string,
    modalActions: React.ReactNode
  }
) => {
  return createPortal(
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{ backdropFilter: 'blur(5px)' }}
    >
      <Box
        position="absolute"
        sx={{
          p: 0,
          width: {
            xs: '100%',
            sm: 500,
            md: 550
          },
          overflow: 'hidden',
          backgroundColor: 'white',
          borderRadius: 2,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 0
        }}>
        <ModalFlashMessage />
        <Box className="modal-header block">
          <Typography
            variant="h2"
            id="parent-modal-title"
            textAlign="center"
            fontWeight="700"
            pt={4}
            pb={2}
            fontSize={26}
            className="text-main"
          >
            {modalTitle}
          </Typography>
          <Divider />
        </Box>
        <Box p={1} className="modal-body">
          <Scrollbars
            className="mb-4 modal-body-scrollbar"
            style={{ width: 100 + '%', height: 400 }}
            universal={true}
          >
            {children}
          </Scrollbars>
        </Box>
        <Stack
          p={3}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={
            {
              backgroundImage: 'linear-gradient(to bottom, transparent 0%, transparent 75%, #f1f1f1 100%)'
            }
          }
        >
          <Button className="btn btn-light me-2" onClick={onClose}>
            close
          </Button>
          {
            modalActions
          }
        </Stack>
      </Box>
    </Modal>,
    document.body
  );
}

export default ModalContent;
