import { useState, useEffect,forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormHelperText, Input, FormLabel, FormControl } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/documentTypesSlice'
import { getTypesStepData, getTypesStepGuide, updateTypesStepData } from '@/app/api/types'
import ReactHtmlParser from 'react-html-parser'
import { getSubmissionSteps, getWorkflow } from '@/app/api/client'

const TypesStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( stepState );
    const wizard: any = useSelector( wizardState );
    const documentTypes = wizard.documentTypesList;
    const [ isValid, setIsValid ] = useState({
        doc_type: true,
        manuscript_title: true
    });
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/type`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        dispatch( getTypesStepData( getStepDataFromApi ) );
        dispatch( getTypesStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect(() => {
        if ( wizard.isVerified ) {
            setIsValid( prevState => ({
                ...prevState,
                doc_type: formState.value.doc_type !== '',
                manuscript_title: formState.value.manuscript_title !== ''
            }));
        }
    }, [wizard.isVerified]);
    const getWorkflowFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }`;
    const getStepsFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/steps`;
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateTypesStepData( getStepDataFromApi ) ).then( () => {
            if ( formState.value.doc_type === undefined ) {
                dispatch( getWorkflow( getWorkflowFromApi ) );
                dispatch( getSubmissionSteps( getStepsFromApi ) );
            }
          }); 
          
        }
    }));

    return (
        <>
            <div id="types" className="tab">
                <h3 className="mb-4 text-shadow-white">Types</h3>
                {   
                    formState.stepGuide !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                }
                <FormControl className="mb-3" error={ formState.value.doc_type === '' && !isValid.doc_type }>
                    <FormLabel className="fw-bold mb-1">
                        Manuscript Type
                    </FormLabel>
                    { documentTypes ? (
                        <Autocomplete
                            required
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="doc_type"
                            id="doc_type"
                            options={ 
                                Array.isArray( documentTypes ) 
                                ? documentTypes.map( 
                                    item => {
                                        return item.attributes?.title || '' 
                                    }
                                   ) : []
                            }
                            value={
                                formState.value.doc_type !== ''
                                  ? documentTypes
                                      .find( ( item: any ) => parseInt( item.id ) === parseInt( formState.value.doc_type )  )?.attributes?.title
                                  : null
                            }
                            onChange={(event, value) => {
                                dispatch( handleInput({ 
                                        name: 'doc_type',
                                        value: documentTypes.find( 
                                            ( item: any ) => item.attributes.title === value )?.id || '' } 
                                            ) 
                                        )
                            }}
                        />
                        ) : (
                        <div>Loading document types...</div>
                    )}
                    {
                        ( formState.value.doc_type === '' && !isValid.doc_type ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should select a document type</FormHelperText> 
                    }
                </FormControl>
                <FormControl className="mb-3" error={formState.value.manuscript_title === '' && !isValid.manuscript_title}>
                    <FormLabel className="fw-bold mb-1">
                        Title
                    </FormLabel>
                    <Input
                        required
                        variant="soft"
                        name="manuscript_title"
                        id="manuscript_title"
                        placeholder="Manuscript Title"
                        value={ formState.value.manuscript_title }
                        onChange={ event => dispatch( handleInput( { name: event.target.name, value: event.target.value } ) ) }
                    />
                    {
                        ( formState.value.manuscript_title === '' && !isValid.manuscript_title ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should enter a title for your manuscript</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

TypesStep.displayName = 'TypesStep';

export default TypesStep;