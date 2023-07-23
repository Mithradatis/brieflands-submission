import { useState, useEffect } from 'react'
import { Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { MuiFileInput } from 'mui-file-input'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState } from '@/app/features/submission/documentFilesSlice'
import { getDocumentFiles, getFilesStepData, getFilesStepGuide } from '@/app/api/files'
import DataTable, { TableColumn } from 'react-data-table-component'
import ReactHtmlParser from 'react-html-parser'

const FilesStep = () => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        old_files: [],
        new_files: []
    });
    useEffect(() => {
        if ( wizard.formStep === 'files' ) {
            const getAllDocumentTypesFromApi = 'http://apcabbr.brieflands.com.test/api/v1/journal/files';
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/files`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getDocumentFiles( getAllDocumentTypesFromApi ) );
            dispatch( getFilesStepData( getStepDataFromApi ) );
            dispatch( getFilesStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'files' ) {
            const formIsValid = Object.values( formState.value ).every(value => value !== '');
            dispatch( formValidator( formIsValid ) );
            console.log( formState.value );
        }
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect(() => {
        if ( wizard.formStep === 'files' ) {
            if ( wizard.isVerified ) {
                setIsValid( prevState => ({
                    ...prevState,
                    doc_type: formState.value.files !== '',
                }));
            }
        }
    }, [wizard.isVerified]);

    return (
        <>
            <div id="files" className={`tab${wizard.formStep === 'files' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Files</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                {/* <MuiFileInput
                    placeholder="Insert a file"
                    onChange={
                        ( event: any, value: File ) => dispatch( handleFilesTable( value ) ) 
                    }
                /> */}
                {/* { 
                    formState.value.old_files.length > 0 &&
                    <div className="datatable-container">
                        <DataTable
                            title={<h4 className="fs-6 mb-0">Authors List</h4>}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            persistTableHead
                            pagination
                            columns={columns}
                            data={filteredItems}
                        />
                    </div> 
                } */}
            </div>
        </>
    );
}

export default FilesStep;