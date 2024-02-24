import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { FormControl, FormLabel, Textarea, FormHelperText } from '@mui/joy'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/ethical-statements/ethicalStatementsSlice'
import { 
    getClinicalTrialRegistrationCodeStepData, 
    getClinicalTrialRegistrationCodeStepGuide, 
    updateClinicalTrialRegistrationCodeStepData 
} from '@/lib/api/steps/clinical-trial-registration-code' 
import { 
    getEthicalApprovalStepData, 
    getEthicalApprovalStepGuide, 
    updateEthicalApprovalStepData 
} from '@/lib/api/steps/ethical-approval'
import { 
    getInformedConsentStepData, 
    getInformedConsentStepGuide, 
    updateInformedConsentStepData 
} from '@/lib/api/steps/informed-consent'
import { 
    getDataAvailabilityStepData, 
    getDataAvailabilityStepGuide, 
    updateDataAvailabilityStepData 
} from '@/lib/api/steps/data-availability'

const EthicalStatementsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( ( state: any ) => state.ethicalStatementsSlice );
    const wizard: any = useSelector( ( state: any ) => state.wizardSlice );
    const [ subSteps, setSubSteps ]: any = useState([]);
    const [ clinicalTrialRegistrationCodeStep, setClinicalTrialRegistrationCodeStep ] = useState( false );
    const [ ethicalApprovalStep, setEthicalApprovalStep ] = useState( false );
    const [ informedConsentStep, setInformedConsentStep ] = useState( false );
    const [ dataAvailabilityStep, setDataAvailabilityStep ] = useState( false );
    const clinicalTrialRegistrationCodeDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'clinical_trial_registration_code' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const ethicalApprovalDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'ethical_approval' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const informedConsentDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'informed_consent' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const dataAvailabilityDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'data_availability' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getClinicalTrialRegistrationCodeDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/clinical_trial_registration_code`;
    const getEthicalApprovalDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/ethical_approval`;
    const getInformedConsentDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/informed_consent`;
    const getDataAvailabilityDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/data_availability`;
    const getClinicalTrialRegistrationCodeDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.clinical_trial_registration_code`;
    const getEthicalApprovalDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.ethical_approval`;
    const getInformedConsentDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.informed_consent`;
    const getDataAvailabilityDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.data_availability`;
    const [ isValid, setIsValid ] = useState({
        clinicalTrialRegistrationCode: true,
        ethicalApproval: true,
        informedConsent: true,
        dataAvailability: true
    });
    useEffect( () => {
        const subStepsList = wizard.formSteps.length > 0 ? wizard.formSteps.find( ( item: any ) => item.attributes.slug === wizard.formStep ).attributes.subSteps : [];
        setSubSteps( subStepsList );
        if ( subStepsList.length > 0 ) {
            subStepsList.map( ( subStep: any ) =>  {
                subStep.slug === 'clinical_trial_registration_code' && setClinicalTrialRegistrationCodeStep( true );
                subStep.slug === 'ethical_approval' && setEthicalApprovalStep( true );
                subStep.slug === 'informed_consent' && setInformedConsentStep( true );
                subStep.slug === 'data_availability' && setDataAvailabilityStep( true );
            });
        } 
    }, [wizard.formSteps]);
    useEffect( () => {
        if ( wizard.formStep === 'ethical_statements' ) {
            dispatch( getClinicalTrialRegistrationCodeStepData( getClinicalTrialRegistrationCodeDataFromApi ) );
            dispatch( getEthicalApprovalStepData( getEthicalApprovalDataFromApi ) );
            dispatch( getInformedConsentStepData( getInformedConsentDataFromApi ) );
            dispatch( getDataAvailabilityStepData( getDataAvailabilityDataFromApi ) );
            dispatch( getClinicalTrialRegistrationCodeStepGuide( getClinicalTrialRegistrationCodeDictionaryFromApi ) );
            dispatch( getEthicalApprovalStepGuide( getEthicalApprovalDictionaryFromApi ) );
            dispatch( getInformedConsentStepGuide( getInformedConsentDictionaryFromApi ) );
            dispatch( getDataAvailabilityStepGuide( getDataAvailabilityDictionaryFromApi ) );
        }
        dispatch( formValidator( true ) );
    }, []);
    useEffect(() => {
        if ( subSteps.length > 0 ) {
            const requiredFields: any = [];
            subSteps.map( ( item: any ) =>  {
                item.required && requiredFields.push( item.slug ); 
            });
            const formIsValid = Object.entries( formState.value ).every( ( [ key, value ] ) =>  {
                const step: any = value;
                return requiredFields.includes( key ) ? step.text !== '' : true 
            });
            dispatch( formValidator( formIsValid ) );
        }
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if ( wizard.isVerified ) {
            setIsValid( prevState => ({
                ...prevState,
                clinicalTrialRegistrationCode: subSteps.find( ( item: any ) => item.slug === 'clinical_trial_registration_code' )?.required ? formState.value?.clinical_trial_registration_code?.text !== '' : true,
                ethicalApproval: subSteps.find( ( item: any ) => item.slug === 'ethical_approval' )?.required ? formState.value?.ethical_approval?.text !== '' : true,
                informedConsent: subSteps.find( ( item: any ) => item.slug === 'informed_consent' )?.required ? formState.value?.informed_consent?.text !== '' : true,
                dataAvailability: subSteps.find( ( item: any ) => item.slug === 'data_availability' )?.required ? formState.value?.data_availability?.text !== '' : true
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
            dispatch( handleLoading( true ) );
            let isAllowed = false;
            try {
                await dispatch( updateClinicalTrialRegistrationCodeStepData( getClinicalTrialRegistrationCodeDataFromApi ) );
                await dispatch( updateEthicalApprovalStepData( getEthicalApprovalDataFromApi ) );
                await dispatch( updateInformedConsentStepData( getInformedConsentDataFromApi ) );
                await dispatch( updateDataAvailabilityStepData( getDataAvailabilityDataFromApi ) );
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
                        || ( dataAvailabilityStep && typeof formState.stepGuide.dataAvailability !== 'string' ) 
                    ) ) 
                    ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="ethical-statements" className={ `tab ${ ( formState.isLoading 
                    || ( 
                        ( clinicalTrialRegistrationCodeStep && typeof formState.stepGuide.clinicalTrialRegistrationCode !== 'string' )
                        || ( ethicalApprovalStep && typeof formState.stepGuide.ethicalApproval !== 'string' )
                        || ( informedConsentStep && typeof formState.stepGuide.informedConsent !== 'string' )
                        || ( dataAvailabilityStep && typeof formState.stepGuide.dataAvailability !== 'string' ) 
                    ) ) 
                    ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Ethical Statements</h3>
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
                        ( dataAvailabilityStep && formState.stepGuide.dataAvailability !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.dataAvailability ) }</div>
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
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'clinical_trial_registration_code' ).required ? ' required' : '' }`}
                                error={ wizard.isVerified && formState.value?.clinical_trial_registration_code?.text === '' && !isValid.clinicalTrialRegistrationCode }>
                                <FormLabel className="fw-bold mb-1">
                                    Clinical Trial Registration Code
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="clinical_trial_registration_code"
                                    id="clinicalTrialRegistrationCode"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    value={ formState.value?.clinical_trial_registration_code?.text ? formState.value?.clinical_trial_registration_code?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.clinical_trial_registration_code?.text === '' && !isValid.clinicalTrialRegistrationCode ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText> 
                                }
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
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'ethical_approval' ).required ? ' required' : '' }`}
                                error={ wizard.isVerified && formState.value?.ethical_approval?.text === '' && !isValid.ethicalApproval }>
                                <FormLabel className="fw-bold mb-1">
                                    Ethical Approval
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="ethical_approval"
                                    id="ethicalApproval"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    value={ formState.value?.ethical_approval?.text ? formState.value?.ethical_approval?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.ethical_approval?.text === '' && !isValid.ethicalApproval ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText> 
                                }
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
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'informed_consent' ).required ? ' required' : '' }`}
                                error={ wizard.isVerified && formState.value?.informed_consent?.text === '' && !isValid.informedConsent }>
                                <FormLabel className="fw-bold mb-1">
                                    Informed Consent
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="informed_consent"
                                    id="informedConsent"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    value={ formState.value?.informed_consent?.text ? formState.value?.informed_consent?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.informed_consent?.text === '' && !isValid.informedConsent ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText>
                                }
                            </FormControl>
                        </div>
                }
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'data_availability' ) ) &&
                        <div id="data-availability">
                            {
                                ( dataAvailabilityDetails !== undefined && dataAvailabilityDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( dataAvailabilityDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'data_availability' ).required ? ' required' : '' }`}
                                error={ wizard.isVerified && formState.value?.data_availability?.text === '' && !isValid.dataAvailability }>
                                <FormLabel className="fw-bold mb-1">
                                    Data Availability
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="data_availability"
                                    id="dataAvailability"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    value={ formState.value?.data_availability?.text ? formState.value?.data_availability?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.data_availability?.text === '' && !isValid.dataAvailability ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText>
                                }
                            </FormControl>
                        </div>
                }
            </div>
        </>
    );
});

EthicalStatementsStep.displayName = 'EthicalStatementsStep';

export default EthicalStatementsStep;