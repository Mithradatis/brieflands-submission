import { useSelector, useDispatch } from 'react-redux'
import { Modal, ModalDialog } from '@mui/joy'
import { handleClose } from '@/lib/features/modal/modalSlice'
import ModalContent from '@/components/modal'
import Image from 'next/image'
import Logo from '@/assets/images/brieflands-logo.png'

export default function Container () {
    const dispatch: any = useDispatch();
    const wizard: any = useSelector( ( state: any ) => state.wizardSlice );
    const modalData = useSelector( ( state: any ) => state.modalSlice );
    const handleModalClose = () => {
        dispatch( handleClose() );
    }

    return (
        <>
            <div id="loading" className={`d-flex flex-column align-items-center justify-content-center ${ wizard.isLoading ? ' d-block' : ' d-none'}`}>
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