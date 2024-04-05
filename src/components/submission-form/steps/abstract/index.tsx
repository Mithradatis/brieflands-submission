import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch } from '@/app/store'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { handleSnackbarOpen } from '@features/snackbar/snackbarSlice'
import { formValidator } from '@features/wizard/wizardSlice'
import { handleLoading } from '@features/submission/steps/abstract/abstractSlice'
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const AbstractStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string,
            workflowId: string
        }, 
        ref 
    ) => {
    const [ formData, setFormData ] = useState({
        text: ''
    });
    const [ wordCount, setWordCount ] = useState( 0 );
    const dispatch = useAppDispatch();
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    useEffect( () => {
        if ( stepData ) {
            setFormData( stepData );
        }
    }, [stepData]);
    useEffect( () => {
        dispatch( formValidator( true ) );
    }, []);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await updateStepDataTrigger( 
                { 
                    url: props.apiUrls.stepDataApiUrl, 
                    data: formData 
                } 
            );
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
            dispatch( 
                handleSnackbarOpen( 
                    { 
                        severity: 'error', 
                        message: `You can enter only ${ maximumWordCount } words as abstract` 
                    } 
                ) 
            );
        } else {
            if ( wordCounter?.classList.contains('text-danger') ) {
                wordCounter?.classList.remove('text-danger');
            }
            setFormData( { text: value } );
        }
    }

    return (
        isLoading
            ? <StepPlaceholder/>
            :
                <div id="abstract" className="tab">
                    <h3 className="mb-4 text-shadow-white">
                        Abstract
                    </h3>
                    {
                        ( props.details !== undefined && props.details !== '' ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
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
                            value={ formData?.text ? formData?.text : '' }
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
    );
});

AbstractStep.displayName = 'AbstractStep';

export default AbstractStep;