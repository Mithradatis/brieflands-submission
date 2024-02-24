import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/twitter/twitterSlice'
import { 
    getTwitterStepGuide, 
    getTwitterStepData, 
    updateTwitterStepData 
} from '@/lib/api/steps/twitter' 

const TwitterStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.twitterSlice );
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        if ( wizard.formStep === 'twitter' ) {
            dispatch( getTwitterStepData( getStepDataFromApi ) );
            dispatch( getTwitterStepGuide( getDictionaryFromApi ) );
            dispatch( formValidator( true ) );
        }
    }, []);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await dispatch( updateTwitterStepData( getStepDataFromApi ) );
            
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
            <div id="twitter" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Twitter</h3>
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
                        Twitter
                    </FormLabel>
                    <Textarea
                        variant="soft"
                        name="twitter"
                        id="twitter"
                        className="rounded"
                        aria-label="textarea"
                        placeholder="Enter your text here"
                        minRows={4}
                        maxRows={10}
                        value={ formState.value?.text ? formState.value?.text : '' }
                        onChange={( event: any ) => {
                            dispatch( handleInput( event.target.value ) );
                        }}
                    />
                </FormControl>
            </div>
        </>
    );
});

TwitterStep.displayName = 'TwitterStep';

export default TwitterStep;