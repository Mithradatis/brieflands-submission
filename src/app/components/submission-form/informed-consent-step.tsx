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
    const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
    const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        if ( wizard.formStep === 'informed_consent' ) {
            dispatch( getInformedConsentStepData( getStepDataFromApi ) );
            dispatch( getInformedConsentStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateInformedConsentStepData( getStepDataFromApi ) );
        }
    }));

    return (
        <>
            <div id="informed-consent" className={`tab${wizard.formStep === 'informed_consent' ? ' active' : ''}`}>
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
                            dispatch( handleInput( {name: event.target.name, value: event.target.value} ) );
                        }}
                    />
                </FormControl>
            </div>
        </>
    );
});

export default InformedConsentStep;