import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { saveModal } from '@/lib/features/modal/modalSlice'
import { saveAuthorModal, resetAddAuthorForm } from '@/lib/features/modal/addAuthorModalSlice'
import { saveReviewerModal, resetAddReviewerForm } from '@/lib/features/modal/addReviewerModalSlice'
import { handleAuthorOperation, handleCloseAuthorModal } from '@/lib/api/steps/authors'
import { handleReviewerOperation } from '@/lib/api/steps/reviewers'
import { Scrollbars } from 'react-custom-scrollbars-2'
import AddAuthorModal from '@/components/modal/forms/add-author'
import AddReviewerModal from '@/components/modal/forms/add-reviewer'
import Divider from '@mui/material/Divider'
import ModalFlashMessage from '@/components/snackbar/snackbar-modal'

const ModalContent = () => {
    const [renderedComponent, setRenderedComponent] = useState<React.ReactNode | null>(null);
    const [ action, setAction ] = useState<React.ReactNode | null>( null );
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const modalData = useSelector( ( state: any ) => state.modalSlice );
    const dispatch: any = useDispatch();
    useEffect(() => {
        switch ( modalData.modalForm ) {
          case 'authors':
            setRenderedComponent(<AddAuthorModal />);
            if ( modalData.mode === 'new' ) {
              dispatch( resetAddAuthorForm() );
            }
            break;
          case 'reviewers':
            setRenderedComponent(<AddReviewerModal />);
            if ( modalData.mode === 'new' ) {
              dispatch( resetAddReviewerForm() );
            }
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
                        className="mb-4 modal-body-scrollbar"
                        style={{ width: 100 + '%', height: 400 }}
                        universal={true}>
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
