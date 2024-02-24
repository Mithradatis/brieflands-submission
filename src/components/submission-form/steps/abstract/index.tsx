import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/abstract/abstractSlice'
import { getAbstractStepGuide, getAbstractStepData, updateAbstractStepData } from '@/lib/api/steps/abstract'
import { handleSnackbarOpen } from '@/lib/features/snackbar/snackbarSlice' 

const AbstractStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const wizard: any = useSelector( ( state: any ) => state.wizardSlice );
    const formState: any = useSelector( ( state: any ) => state.abstractSlice );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    const [ wordCount, setWordCount ] = useState( 0 );
    useEffect( () => {
        if ( wizard.formStep === 'abstract' ) {
            dispatch( getAbstractStepData( getStepDataFromApi ) );
            dispatch( getAbstractStepGuide( getDictionaryFromApi ) );
            dispatch( formValidator( true ) );
        }
    }, []);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await dispatch( updateAbstractStepData( getStepDataFromApi ) );
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));
    const countValidation = ( value: string ) => {
        const maximumWordCount = 600;
        const wordsCount: number = value.trim().split(/\s+/).length;
        setWordCount( wordsCount );
        const wordCounter = document.getElementById('word-count');
        if ( wordsCount > maximumWordCount ) {
            wordCounter?.classList.add('text-danger');
            dispatch( handleSnackbarOpen( { severity: 'error', message: `You can enter only ${ maximumWordCount } words as abstract` } ) );
        } else {
            if ( wordCounter?.classList.contains('text-danger') ) {
                wordCounter?.classList.remove('text-danger');
            }
            dispatch( handleInput( value ) );
        }
    }

    return (
        <>
            <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="abstract" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Abstract</h3>
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
                <FormControl className="mb-3">
                    <FormLabel className="fw-bold mb-1">
                        Abstract
                    </FormLabel>
                    <Textarea
                        variant="soft"
                        name="abstract"
                        id="abstract"
                        className="rounded pb-4"
                        aria-label="textarea"
                        placeholder="Enter your text here"
                        minRows={4}
                        maxRows={10}
                        value={ formState.value?.text ? formState.value?.text : '' }
                        onChange={( event: any ) => {
                            countValidation( event.target.value );
                        }}
                    />
                    <div className="word-count fs-7">
                        <span id="word-count" className="position-relative me-1">
                            { wordCount || 0 }
                        </span>
                        <span className="opacity-50">
                            / 600 words
                        </span>
                    </div>
                </FormControl>
            </div>
        </>
    );
});

AbstractStep.displayName = 'AbstractStep';

export default AbstractStep;