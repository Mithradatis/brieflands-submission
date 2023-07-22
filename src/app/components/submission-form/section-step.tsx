import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { handleInput, stepState } from '@/app/features/submission/documentSectionSlice'
import { getDocumentSections, getSectionStepData, getSectionStepGuide } from '@/app/api/section'
import ReactHtmlParser from 'react-html-parser'

const SectionStep = () => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const documentSections = formState.documentSectionsList;
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        id: true,
    });
    useEffect(() => {
        if ( wizard.formStep === 'section' ) {
            const getAllDocumentTypesFromApi = 'http://apcabbr.brieflands.com.test/api/v1/journal/section';
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/section`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getDocumentSections( getAllDocumentTypesFromApi ) );
            dispatch( getSectionStepData( getStepDataFromApi ) );
            dispatch( getSectionStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'section' ) {
            const formIsValid = Object.values( formState.value ).every(value => value !== '');
            dispatch( formValidator( formIsValid ) );
        }
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect(() => {
        if ( wizard.formStep === 'section' ) {
            if ( wizard.isVerified ) {
                setIsValid( prevState => ({
                    ...prevState,
                    id: formState.value.id !== ''
                }));
            }
        }
    }, [wizard.isVerified]);

    return (
        <>
            <div id="section" className={`tab${wizard.formStep === 'section' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Section</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={formState.value.id === '' && !isValid.id}>
                    <FormLabel className="fw-bold mb-1">
                        Please Choose
                    </FormLabel>
                    <Autocomplete
                        key="documentSection"
                        required
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
                            formState.value.id !== ''
                              ? documentSections
                                  .find( ( item: any ) => formState.value.id === item.id )?.attributes?.title
                              : null
                        }
                        onChange={(event, value) => {
                            dispatch( handleInput({ 
                                    name: 'id',
                                    value: documentSections.find( 
                                        ( item: any ) => item.attributes.title === value )?.id || '' } 
                                        ) 
                                    )
                        }}
                    />
                    {
                        ( formState.value.id === '' && !isValid.id )
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
}

export default SectionStep;