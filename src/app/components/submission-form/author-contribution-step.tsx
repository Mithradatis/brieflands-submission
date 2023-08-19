import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput } from '@/app/features/submission/authorContributionSlice'
import { getAuthorContributionStepData, getAuthorContributionStepGuide, updateAuthorContributionStepData } from '@/app/api/authorContribution' 
import ReactHtmlParser from 'react-html-parser'

const AuthorContributionStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        dispatch( getAuthorContributionStepData( getStepDataFromApi ) );
        dispatch( getAuthorContributionStepGuide( getDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateAuthorContributionStepData( getStepDataFromApi ) );

          return true;
        }
    }));

    return (
        <>
            <div id="author-contribution" className="tab">
                <h3 className="mb-4 text-shadow-white">Author Contribution</h3>
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
                <FormControl className="mb-3">
                    <FormLabel className="fw-bold mb-1">
                        Author Contribution
                    </FormLabel>
                    <Textarea
                        variant="soft"
                        name="authorContribution"
                        id="authorContribution"
                        className="rounded"
                        aria-label="textarea"
                        placeholder="Enter your text here"
                        minRows={4}
                        maxRows={10}
                        defaultValue={ formState.value.text ? formState.value.text : '' }
                        onChange={( event: any ) => {
                            dispatch( handleInput( event.target.value ) );
                        }}
                    />
                </FormControl>
            </div>
        </>
    );
});

AuthorContributionStep.displayName = 'AuthorContributionStep';

export default AuthorContributionStep;