import { Button, TextField, Alert, AlertTitle } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'

const AuthorsStep = ({formStep, handleModal}) => {

    return (
        <>
            <div id="authors" className={`tab${formStep === 'authors' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Authors</h3>
                <Scrollbars
                    autoHide
                    autoHideTimeout={500}
                    autoHideDuration={200}>
                    <Alert severity="info" className="mb-4">
                        <AlertTitle>Important Note</AlertTitle>
                        How to Add a new Author?
                        <ul>
                            <li>
                                First, type the author's email (in the Email field) and click "Search." 
                            </li>
                            <li>
                                If the author is already registered with the publisher, add the author to the list of authors.
                            </li>
                            <li>
                                If the author is not registered yet in our publisher, complete the author information and proceed.
                            </li>
                            <li>
                                To edit authors' affiliations, press the Edit button.
                            </li>
                        </ul>
                    </Alert>
                </Scrollbars>
                <Button className="btn btn-primary btn-lg mb-4" onClick={handleModal}>Add Author</Button>
            </div>
        </>
    );
}

export default AuthorsStep;