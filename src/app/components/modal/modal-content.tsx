import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { modalState, saveModal } from '@/app/features/modal/modalSlice'
import { saveAuthorModal } from '@/app/features/modal/addAuthorModalSlice'
import { saveReviewerModal } from '@/app/features/modal/addReviewerModalSlice'
import { handleAuthorOperation, handleCloseAuthorModal } from '@/app/api/author'
import { handleReviewerOperation } from '@/app/api/reviewers'
import { Scrollbars } from 'react-custom-scrollbars'
import AddAuthorModal from '@/app/components/modal/add-author'
import AddReviewerModal from '@/app/components/modal/add-reviewer'
import Divider from '@mui/material/Divider'
import ModalFlashMessage from '@/app/components/snackbar/modal-snackbar'
import '@/app/resources/css/modal.scss'

const ModalContent = () => {
    const [renderedComponent, setRenderedComponent] = useState<React.ReactNode | null>(null);
    const [ action, setAction ] = useState<React.ReactNode | null>( null );
    const wizard = useSelector( wizardState );
    const modalData = useSelector( modalState );
    const dispatch: any = useDispatch();
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
      useEffect(() => {
        switch ( modalData.modalForm ) {
            case 'authors':
                setAction(
                    <Button className="btn btn-primary" 
                        onClick={ () => {
                            dispatch( handleCloseAuthorModal() ); 
                            dispatch( handleAuthorOperation() ); 
                          } 
                        }>
                      {modalData.modalActionButton.caption}
                    </Button>
                );
              break;
            case 'reviewers':
              setAction( 
                  <Button className="btn btn-primary"
                      onClick={() => dispatch( handleReviewerOperation() )}>
                      { modalData.modalActionButton.caption }
                  </Button>
              );
              break;
            default:
              setRenderedComponent(null);
              break;
          }
      }, [modalData.modalActionButton]);

    return (
        <>
            <ModalFlashMessage/>
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
                <Button className="btn btn-light me-2" 
                  onClick={ () => {
                    switch( modalData.modalForm ) {
                      case 'authors':
                        dispatch( handleCloseAuthorModal() );
                        dispatch( saveAuthorModal() )
                      break;
                      case 'reviewers':
                        dispatch( saveReviewerModal() );
                        break;
                    }
                    dispatch( saveModal() ) } 
                  }>
                    close    
                </Button>
                { action }
            </div>
        </>
    );    
}

export default ModalContent;
