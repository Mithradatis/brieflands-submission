import { useState, useEffect } from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { modalState } from '@/app/features/modal/modalSlice'
import { buildAuthorsTableRow } from '@/app/features/modal/addAuthorModalSlice'
import { Scrollbars } from 'react-custom-scrollbars'
import AddAuthorModal from '@/app/components/modal/add-author'
import AddReviewerModal from '@/app/components/modal/add-reviewer'
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
          case 'reviewers':
            setRenderedComponent(<AddReviewerModal />);
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
                <Scrollbars
                        className="mb-4"
                        style={{ width: 100 + '%', height: 300 }}
                        universal={true}
                        autoHide
                        autoHideTimeout={300}
                        autoHideDuration={300}>
                    { renderedComponent }
                </Scrollbars>
            </div>
            <div className="modal-footer">
                <Button className="button btn_primary"
                    onClick={() => dispatch( buildAuthorsTableRow() )}>
                    Add
                </Button>
            </div>
        </>
    );    
}

export default ModalContent;
