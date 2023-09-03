import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput, handleLoading } from '@/app/features/submission/permissionsSlice'
import { getClinicalTrialRegistrationCodeStepData, getClinicalTrialRegistrationCodeStepGuide, updateClinicalTrialRegistrationCodeStepData } from '@/app/api/clinicalTrialRegistrationCode' 
import { getEthicalApprovalStepData, getEthicalApprovalStepGuide, updateEthicalApprovalStepData } from '@/app/api/ethicalApproval'
import { getInformedConsentStepData, getInformedConsentStepGuide, updateInformedConsentStepData } from '@/app/api/informedConsent'
import { getDataReproducibilityStepData, getDataReproducibilityStepGuide, updateDataReproducibilityStepData } from '@/app/api/dataReproducibility'

import ReactHtmlParser from 'react-html-parser'

const FootnotesStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( stepState );
    const wizard: any = useSelector( wizardState );
    const [ subSteps, setSubSteps ]: any = useState([]);
    const [ clinicalTrialRegistrationCodeStep, setClinicalTrialRegistrationCodeStep ] = useState( false );
    const [ ethicalApprovalStep, setEthicalApprovalStep ] = useState( false );
    const [ informedConsentStep, setInformedConsentStep ] = useState( false );
    const [ dataReproducibilityStep, setDataReproducibilityStep ] = useState( false );
    const clinicalTrialRegistrationCodeDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'clinical_trial_registration_code' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const ethicalApprovalDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'ethical_approval' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const informedConsentDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'informed_consent' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const dataReproducibilityDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'data_reproducibility' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getClinicalTrialRegistrationCodeDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/clinical_trial_registration_code`;
    const getEthicalApprovalDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/ethicalApproval`;
    const getInformedConsentDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/informed_consent`;
    const getDataReproducibilityDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/data_reproducibility`;
    const getClinicalTrialRegistrationCodeDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.clinical_trial_registration_code`;
    const getEthicalApprovalDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.ethical_approval`;
    const getInformedConsentDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.informed_consent`;
    const getDataReproducibilityDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.data_reproducibility`;
    useEffect( () => {
        const subStepsList = wizard.formSteps.length > 0 ? wizard.formSteps.find( ( item: any ) => item.attributes.slug === wizard.formStep ).attributes.subSteps : [];
        setSubSteps( subStepsList );
        if ( subStepsList.length > 0 ) {
            subStepsList.map( ( subStep: any ) =>  {
                subStep.slug === 'clinical_trial_registration_code' && setClinicalTrialRegistrationCodeStep( true );
                subStep.slug === 'ethical_approval' && setEthicalApprovalStep( true );
                subStep.slug === 'informed_consent' && setInformedConsentStep( true );
                subStep.slug === 'data_reproducibility' && setDataReproducibilityStep( true );
            });
        } 
    }, [wizard.formSteps]);
    useEffect( () => {
        dispatch( getClinicalTrialRegistrationCodeStepData( getClinicalTrialRegistrationCodeDataFromApi ) );
        dispatch( getEthicalApprovalStepData( getEthicalApprovalDataFromApi ) );
        dispatch( getInformedConsentStepData( getInformedConsentDataFromApi ) );
        dispatch( getDataReproducibilityStepData( getDataReproducibilityDataFromApi ) );
        dispatch( getClinicalTrialRegistrationCodeStepGuide( getClinicalTrialRegistrationCodeDictionaryFromApi ) );
        dispatch( getEthicalApprovalStepGuide( getEthicalApprovalDictionaryFromApi ) );
        dispatch( getInformedConsentStepGuide( getInformedConsentDictionaryFromApi ) );
        dispatch( getDataReproducibilityStepGuide( getDataReproducibilityDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
            dispatch( handleLoading( true ) );
            let isAllowed = false;
            try {
                await dispatch( updateClinicalTrialRegistrationCodeStepData( getClinicalTrialRegistrationCodeDataFromApi ) );
                await dispatch( updateEthicalApprovalStepData( getEthicalApprovalDataFromApi ) );
                await dispatch( updateInformedConsentStepData( getInformedConsentDataFromApi ) );
                await dispatch( updateDataReproducibilityStepData( getDataReproducibilityDataFromApi ) );
                isAllowed = true;
            } catch (error) {
                console.error("Error while submitting form:", error);
            }

            return isAllowed;
        }
    }));

    return (
        <>
            <div className={ `step-loader ${ ( formState.isLoading 
                    || ( 
                        ( clinicalTrialRegistrationCodeStep && typeof formState.stepGuide.clinicalTrialRegistrationCode !== 'string' )
                        || ( ethicalApprovalStep && typeof formState.stepGuide.ethicalApproval !== 'string' )
                        || ( informedConsentStep && typeof formState.stepGuide.informedConsent !== 'string' )
                        || ( dataReproducibilityStep && typeof formState.stepGuide.dataReproducibility !== 'string' ) 
                    ) ) 
                    ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="permissions" className={ `tab ${ ( formState.isLoading 
                    || ( 
                        ( clinicalTrialRegistrationCodeStep && typeof formState.stepGuide.clinicalTrialRegistrationCode !== 'string' )
                        || ( ethicalApprovalStep && typeof formState.stepGuide.ethicalApproval !== 'string' )
                        || ( informedConsentStep && typeof formState.stepGuide.informedConsent !== 'string' )
                        || ( dataReproducibilityStep && typeof formState.stepGuide.dataReproducibility !== 'string' ) 
                    ) ) 
                    ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Permissions</h3>
                <Alert severity="info" className="mb-4">
                    {   
                        ( clinicalTrialRegistrationCodeStep && formState.stepGuide.clinicalTrialRegistrationCode !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.clinicalTrialRegistrationCode ) }</div>
                    }
                    {   
                        ( ethicalApprovalStep && formState.stepGuide.ethicalApproval !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.ethicalApproval ) }</div>
                    }
                    {
                        ( informedConsentStep && formState.stepGuide.informedConsent !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.informedConsent ) }</div>
                    }
                    {
                        ( dataReproducibilityStep && formState.stepGuide.dataReproducibility !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.dataReproducibility ) }</div>
                    }
                 </Alert>
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'clinical_trial_registration_code' ) ) &&
                        <div id="clinical-trial-registration-code">
                            {
                                ( clinicalTrialRegistrationCodeDetails !== undefined && clinicalTrialRegistrationCodeDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( clinicalTrialRegistrationCodeDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'clinical_trial_registration_code' ).required ? ' required' : '' }`}>
                                <FormLabel className="fw-bold mb-1">
                                    Clinical Trial Registration Code
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="clinicalTrialRegistrationCode"
                                    id="clinicalTrialRegistrationCode"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    defaultValue={ formState.value?.clinicalTrialRegistrationCode?.text ? formState.value.clinicalTrialRegistrationCode.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                            </FormControl>
                        </div>
                }
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'ethical_approval' ) ) &&
                        <div id="ethical-approval">
                            {
                                ( ethicalApprovalDetails !== undefined && ethicalApprovalDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( ethicalApprovalDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'ethical_approval' ).required ? ' required' : '' }`}>
                                <FormLabel className="fw-bold mb-1">
                                    Ethical Approval
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="ethicalApproval"
                                    id="ethicalApproval"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    defaultValue={ formState.value?.ethicalApproval?.text ? formState.value.ethicalApproval.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                            </FormControl>
                        </div>
                }
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'informed_consent' ) ) &&
                        <div id="informed-consent">
                            {
                                ( informedConsentDetails !== undefined && informedConsentDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( informedConsentDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'informed_consent' ).required ? ' required' : '' }`}>
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
                                    defaultValue={ formState.value?.informedConsent?.text ? formState.value.informedConsent.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                            </FormControl>
                        </div>
                }
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'data_reproducibility' ) ) &&
                        <div id="data-reproducibility">
                            {
                                ( dataReproducibilityDetails !== undefined && dataReproducibilityDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( dataReproducibilityDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'data_reproducibility' ).required ? ' required' : '' }`}>
                                <FormLabel className="fw-bold mb-1">
                                    Data Reroducibility
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="dataReproducibility"
                                    id="dataReproducibility"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    defaultValue={ formState.value?.dataReproducibility?.text ? formState.value.dataReproducibility.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                            </FormControl>
                        </div>
                }
            </div>
        </>
    );
});

FootnotesStep.displayName = 'FootnotesStep';

export default FootnotesStep;