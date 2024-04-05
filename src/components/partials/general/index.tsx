import { useAppDispatch, useAppSelector } from '@/app/store'
import { Modal, ModalDialog } from '@mui/joy'
import { handleClose } from '@features/modal/modalSlice'
import ModalContent from '@/components/modal'
import Image from 'next/image'
import Logo from '@/assets/images/brieflands-logo.png'

export default function Container () {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector( ( state: any ) => state.wizard.isLoading );
    const modalData = useAppSelector( ( state: any ) => state.modal );
    const handleModalClose = () => {
        dispatch( handleClose() );
    }

    return (
        <>
            { 
                isLoading &&
                    <div id="loading" className="d-flex flex-column align-items-center justify-content-center">
                        <div className="logo p-3 d-flex align-items-center justify-content-center">
                            <Image
                                src={ Logo } 
                                alt="Brieflands"
                                width={25}
                                height={22.5}
                            />
                        </div>
                        <div className="loading"></div>
                    </div>
            }
            <Modal
                id="modal"
                open={modalData.modalOpen}
                onClose={ handleModalClose }
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <ModalDialog sx={{ width: 500 }}>
                    <ModalContent />
                </ModalDialog>
            </Modal>
        </>
        
    )
}