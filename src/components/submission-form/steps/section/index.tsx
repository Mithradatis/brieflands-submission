import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { formValidator, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/section/sectionSlice'
import { 
    getSections,
    getSectionStepData, 
    getSectionStepGuide, 
    updateSectionStepData 
} from '@/lib/api/steps/section'

const SectionStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.sectionSlice );
    const sections = formState.sectionsList;
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const [ isValid, setIsValid ] = useState({
        id: true,
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllTypesFromApi = `${ process.env.API_URL }/journal/section`;
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/section`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'section' ) {
            dispatch( getSections( getAllTypesFromApi ) );
            dispatch( getSectionStepData( getStepDataFromApi ) );
            dispatch( getSectionStepGuide( getDictionaryFromApi ) );
        }
    }, []);
    useEffect(() => {
        const formIsValid = formState.value?.id !== '' && formState.value?.id !== 0;
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if ( wizard.isVerified ) {
            setIsValid( prevState => ({
                ...prevState,
                id: formState.value?.id !== '' && formState.value?.id !== 0,
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await dispatch( updateSectionStepData( getStepDataFromApi ) );
            
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));

    return (
        <>
            <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="section" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Section</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' && (
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                    )
                }
                <FormControl className="mb-3" error={ wizard.isVerified && !isValid.id }>
                    <FormLabel className="fw-bold mb-1">
                        Please Choose
                    </FormLabel>
                    <Autocomplete
                        required
                        key="section"
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Choose one…"
                        disabled={false}
                        name="section"
                        id="section"
                        options={ 
                            Array.isArray( sections ) 
                            ? sections.map( 
                                item => {
                                    return item.attributes?.title || '' 
                                }
                               ) : []
                        }
                        value={
                            ( formState.value && formState.value?.id && formState.value?.id !== 0 && sections.length > 0 )
                              ? sections.find(
                                ( item: any ) => formState.value?.id === parseInt( item.id )
                              )?.attributes?.title
                            : null
                        }
                        onChange={(event, value) => {
                            !wizard.isVerified && dispatch( handleIsVerified() );
                            dispatch( handleInput({ 
                                name: 'id',
                                value: parseInt( sections.find( ( item: any ) => item.attributes.title === value )?.id ) || '' } ) 
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