import AddAuthorModal from './add-author';

const ModalContent = ({calledForm}) => {
    const determineComponentToRender = () => {
       switch ( calledForm ) {
            case 'authors': return <AddAuthorModal />;
       }
      };

    return (
        <>
            <div className="modal-header">
                <h2 id="parent-modal-title">Text in a modal</h2>
            </div>
            <div className="modal-body">
                { determineComponentToRender() }
            </div>
            <div className="modal-footer">

            </div>
        </>
    );    
}

export default ModalContent;
