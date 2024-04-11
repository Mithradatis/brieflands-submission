'use client'

import { useState } from 'react'
import { Modal, ModalDialog, ModalClose } from '@mui/joy'
import { Button } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Divider from '@mui/material/Divider'
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
    return (
      <Modal
        id="modal"
        open={ isOpen }
        onClose={ onClose }
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <ModalDialog sx={{ width: 600 }}>
          <ModalFlashMessage/>
          <ModalClose/>
          <div className="modal-header d-block">
              <h2 id="parent-modal-title" 
              className="fs-4 text-center text-green fw-bold container-fluid my-4">
                  { modalTitle }
              </h2>
              <Divider className="container-fluid mb-4"/>
          </div>
          <div className="modal-body">
              <Scrollbars
                className="mb-4 modal-body-scrollbar"
                style={{ width: 100 + '%', height: 400 }}
                universal={true}
              >
                  { children }
              </Scrollbars>
          </div>
          <div className="modal-footer">
              <Button className="btn btn-light me-2" onClick={onClose}>
                  close    
              </Button>
              {
                modalActions
              }
          </div>
        </ModalDialog>
      </Modal>
    );    
}

export default ModalContent;
