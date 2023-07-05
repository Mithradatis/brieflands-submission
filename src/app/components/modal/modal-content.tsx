import { useState, useEffect, useRef } from 'react'
import AddAuthorModal from './add-author'
import Divider from '@mui/material/Divider'
import './../../resources/css/modal.scss'
import { Button } from '@mui/material'

const ModalContent = ({calledForm, modalCalledFormData, setModalCalledFormData, handleClose}) => {
    const [ modalTitle, setModalTitle ] = useState('');
    const [ renderedComponent, setRenderedComponent ] = useState(null);
    const childRef = useRef();
    useEffect(() => {
        switch (calledForm) {
          case 'authors':
            setModalTitle('Add an Author');
            setRenderedComponent(<AddAuthorModal ref={childRef} modalCalledFormData={modalCalledFormData} setModalCalledFormData={setModalCalledFormData} />);
            break;
          default:
            setModalTitle('');
            setRenderedComponent(null);
            break;
        }
      }, [calledForm]);
    const handleAddClick = () => {
        childRef.current.saveModal();
        handleClose();
    };

    return (
        <>
            <div className="modal-header d-block">
                <h2 id="parent-modal-title" 
                className="fs-4 text-center text-green fw-bold container-fluid mb-4">
                    { modalTitle }
                </h2>
                <Divider className="container-fluid mb-4"/>
            </div>
            <div className="modal-body">
                { renderedComponent }
            </div>
            <div className="modal-footer">
                <Button className="button btn_primary" onClick={handleAddClick}>Add</Button>
            </div>
        </>
    );    
}

export default ModalContent;
