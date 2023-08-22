import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { wizardState, formValidator, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { handleInput, stepState } from '@/app/features/submission/documentSectionSlice'
import { getDocumentSections, getSectionStepData, getSectionStepGuide, updateSectionStepData } from '@/app/api/section'
import ReactHtmlParser from 'react-html-parser'

const SectionStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const documentSections = formState.documentSectionsList;
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        id: true,
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllDocumentTypesFromApi = `${ wizard.baseUrl }/api/v1/journal/section`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/section`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'section' ) {
            dispatch( getDocumentSections( getAllDocumentTypesFromApi ) );
            dispatch( getSectionStepData( getStepDataFromApi ) );
            dispatch( getSectionStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        const formIsValid = formState.value.id !== '' && formState.value.id !== 0;
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if ( wizard.isVerified ) {
            setIsValid( prevState => ({
                ...prevState,
                id: formState.value.id !== '' && formState.value.id !== 0,
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateSectionStepData( getStepDataFromApi ) );
          
          return true;
        }
    }));

    return (
        <>
            <div id="section" className="tab">
                <h3 className="mb-4 text-shadow-white">Section</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={ wizard.isVerified && !isValid.id }>
                    <FormLabel className="fw-bold mb-1">
                        Please Choose
                    </FormLabel>
                    <Autocomplete
                        required
                        key="documentSection"
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Choose one…"
                        disabled={false}
                        name="documentSection"
                        id="documentSection"
                        options={ 
                            Array.isArray( documentSections ) 
                            ? documentSections.map( 
                                item => {
                                    return item.attributes?.title || '' 
                                }
                               ) : []
                        }
                        value={
                            ( formState.value && formState.value.id && formState.value.id !== 0 )
                              ? documentSections.find(
                                ( item: any ) => formState.value.id === parseInt( item.id )
                              )?.attributes?.title
                            : null
                        }
                        onChange={(event, value) => {
                            !wizard.isVerified && dispatch( handleIsVerified() );
                            dispatch( handleInput({ 
                                    name: 'id',
                                    value: parseInt( documentSections.find( ( item: any ) => item.attributes.title === value )?.id ) || '' } ) 
                                    )
                        }}
                    />
                    {
                        ( wizard.isVerified && !isValid.id )
                        && <FormHelperText className="fs-7 text-danger mt-1">You should choose a section.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

SectionStep.displayName = 'SectionStep';

export default SectionStep;