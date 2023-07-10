import { useState, useEffect } from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { modalState } from '@/app/features/modal/modalSlice'
import { buildAuthorTableRow } from '@/app/features/modal/addAuthorModalSlice'
import AddAuthorModal from '@/app/components/modal/add-author'
import Divider from '@mui/material/Divider'
import '@/app/resources/css/modal.scss'

const ModalContent = () => {
    const [renderedComponent, setRenderedComponent] = useState<React.ReactNode | null>(null);
    const modalData = useSelector( modalState );
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    useEffect(() => {
        switch ( modalData.modalForm ) {
          case 'authors':
            setRenderedComponent(<AddAuthorModal />);
            break;
          default:
            setRenderedComponent(null);
            break;
        }
      }, [modalData.modalForm]);

    return (
        <>
            <div className="modal-header d-block">
                <h2 id="parent-modal-title" 
                className="fs-4 text-center text-green fw-bold container-fluid mb-4">
                    { modalData.modalTitle }
                </h2>
                <Divider className="container-fluid mb-4"/>
            </div>
            <div className="modal-body">
                { renderedComponent }
            </div>
            <div className="modal-footer">
                <Button className="button btn_primary"
                    onClick={() => dispatch( buildAuthorTableRow() )}>
                    Add
                </Button>
            </div>
        </>
    );    
}

export default ModalContent;
