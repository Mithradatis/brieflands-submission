import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput } from '@/app/features/submission/informedConsentSlice'
import { getInformedConsentStepGuide, getInformedConsentStepData, updateInformedConsentStepData } from '@/app/api/informedConsent' 
import ReactHtmlParser from 'react-html-parser'

const InformedConsentStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        dispatch( getInformedConsentStepData( getStepDataFromApi ) );
        dispatch( getInformedConsentStepGuide( getDictionaryFromApi ) );
}, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateInformedConsentStepData( getStepDataFromApi ) );

          return true;
        }
    }));

    return (
        <>
            <div id="informed-consent" className="tab">
                <h3 className="mb-4 text-shadow-white">Informed Consent</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3">
                    <FormLabel className="fw-bold mb-1">
                        Informed Consent
                    </FormLabel>
                    <Textarea
                        variant="soft"
                        name="informedConsent"
                        id="informedConsent"
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

InformedConsentStep.displayName = 'InformedConsentStep';

export default InformedConsentStep;