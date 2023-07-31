import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput } from '@/app/features/submission/twitterSlice'
import { getTwitterStepGuide, getTwitterStepData, updateTwitterStepData } from '@/app/api/twitter' 
import ReactHtmlParser from 'react-html-parser'

const TwitterStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        if ( wizard.formStep === 'twitter' ) {
            dispatch( getTwitterStepData( getStepDataFromApi ) );
            dispatch( getTwitterStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateTwitterStepData( getStepDataFromApi ) );
        }
    }));

    return (
        <>
            <div id="twitter" className={`tab${wizard.formStep === 'twitter' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Twitter</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
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
                        defaultValue={ formState.value?.text ? formState.value.text : '' }
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