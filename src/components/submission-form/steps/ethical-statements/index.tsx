import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea, FormHelperText } from '@mui/joy'
import { formValidator } from '@features/wizard/wizardSlice'
import { handleLoading } from '@features/submission/steps/ethical-statements/ethicalStatementsSlice'
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const EthicalStatementsStep = forwardRef(
    ( 
        props: { 
            apiUrls: { 
                stepDataApiUrl: string, 
                stepGuideApiUrl: string 
            },
            workflowId: string,
            screeningDetails: any
        }, 
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const formSteps = useAppSelector( ( state: any ) => state.wizard.formSteps );
    const [ subSteps, setSubSteps ]: any = useState<object[]>();
    const [ clinicalTrialRegistrationCodeStep, setClinicalTrialRegistrationCodeStep ] = useState( false );
    const [ ethicalApprovalStep, setEthicalApprovalStep ] = useState( false );
    const [ informedConsentStep, setInformedConsentStep ] = useState( false );
    const [ dataAvailabilityStep, setDataAvailabilityStep ] = useState( false );
    const [ formData, setFormData ] = useState({
        clinicalTrialRegistrationCode: {
            text: ''
        },
        ethicalApproval: {
            text: ''
        },
        informedConsent: {
            text: ''
        },
        dataAvailability: {
            text: '' 
        }
    });
    const clinicalTrialRegistrationCodeDetails = props.screeningDetails?.find( 
        ( item: any ) => 
            ( 
                item.attributes?.step_slug === 'clinical_trial_registration_code' && 
                item.attributes?.status === 'invalid' 
            ) )?.attributes?.detail || '';
    const ethicalApprovalDetails = props.screeningDetails?.find( 
        ( item: any ) => 
            ( 
                item.attributes?.step_slug === 'ethical_approval' && 
                item.attributes?.status === 'invalid' 
            ) )?.attributes?.detail || '';
    const informedConsentDetails = props.screeningDetails?.find( 
        ( item: any ) => 
            ( 
                item.attributes?.step_slug === 'informed_consent' && 
                item.attributes?.status === 'invalid' 
            ) )?.attributes?.detail || '';
    const dataAvailabilityDetails = props.screeningDetails?.find( 
        ( item: any ) => 
            ( 
                item.attributes?.step_slug === 'data_availability' && 
                item.attributes?.status === 'invalid' 
            ) )?.attributes?.detail || '';
    const getClinicalTrialRegistrationCodeDataFromApi = 
        `${ props.workflowId }/clinical_trial_registration_code`;
    const getEthicalApprovalDataFromApi = 
        `${ props.workflowId }/ethical_approval`;
    const getInformedConsentDataFromApi = 
        `${ props.workflowId }/informed_consent`;
    const getDataAvailabilityDataFromApi = 
        `${ props.workflowId }/data_availability`;
    const getClinicalTrialRegistrationCodeDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }clinical_trial_registration_code`;
    const getEthicalApprovalDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }ethical_approval`;
    const getInformedConsentDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }informed_consent`;
    const getDataAvailabilityDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }data_availability`;
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    const { 
        data: clinicalTrialRegistrationCodeStepGuide, 
        isLoading: clinicalTrialRegistrationCodeStepGuideIsLoading 
    } = useGetStepGuideQuery( getClinicalTrialRegistrationCodeDictionaryFromApi );
    const { 
        data: clinicalTrialRegistrationCodeStepData, 
        isLoading: clinicalTrialRegistrationCodeStepDataIsLoading 
    } = useGetStepDataQuery( getClinicalTrialRegistrationCodeDataFromApi );
    const { 
        data: ethicalApprovalStepGuide, 
        isLoading: ethicalApprovalStepGuideIsLoading 
    } = useGetStepGuideQuery( getEthicalApprovalDictionaryFromApi );
    const { 
        data: ethicalApprovalStepData, 
        isLoading: ethicalApprovalStepDataIsLoading 
    } = useGetStepDataQuery( getEthicalApprovalDataFromApi );
    const { 
        data: informedConsentStepGuide, 
        isLoading: informedConsentStepGuideIsLoading 
    } = useGetStepGuideQuery( getInformedConsentDictionaryFromApi );
    const { 
        data: informedConsentStepData, 
        isLoading: informedConsentStepDataIsLoading 
    } = useGetStepDataQuery( getInformedConsentDataFromApi );
    const { 
        data: dataAvailabilityStepGuide, 
        isLoading: dataAvailabilityStepGuideIsLoading 
    } = useGetStepGuideQuery( getDataAvailabilityDictionaryFromApi );
    const { 
        data: dataAvailabilityStepData, 
        isLoading: dataAvailabilityStepDataIsLoading 
    } = useGetStepDataQuery( getDataAvailabilityDataFromApi );
    const isLoading: boolean = (
        (
            clinicalTrialRegistrationCodeStep &&
            clinicalTrialRegistrationCodeStepGuideIsLoading && 
            clinicalTrialRegistrationCodeStepDataIsLoading && 
            typeof clinicalTrialRegistrationCodeStepGuide !== 'string'
        ) || (
            ethicalApprovalStep &&
            ethicalApprovalStepGuideIsLoading &&
            ethicalApprovalStepDataIsLoading &&
            typeof ethicalApprovalStepGuide !== 'string'
        ) || (
            informedConsentStep &&
            informedConsentStepGuideIsLoading &&
            informedConsentStepDataIsLoading &&
            typeof informedConsentStepGuide !== 'string' 
        ) || (
            dataAvailabilityStep &&
            dataAvailabilityStepGuideIsLoading &&
            dataAvailabilityStepDataIsLoading &&
            typeof dataAvailabilityStepGuide !== 'string' 
        )
    );
    useEffect(() => {
        clinicalTrialRegistrationCodeStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    authorsContribution: clinicalTrialRegistrationCodeStepData 
                } 
            ) 
        );
        ethicalApprovalStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    fundingSupport: ethicalApprovalStepData 
                } 
            ) 
        );
        informedConsentStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    conflictOfIntenrests: informedConsentStepData 
                } 
            ) 
        );
        dataAvailabilityStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    conflictOfIntenrests: dataAvailabilityStepData 
                } 
            ) 
        );
    }, [clinicalTrialRegistrationCodeStep, ethicalApprovalStep, informedConsentStep, dataAvailabilityStep]);
    useEffect( () => {
        const subStepsList = formSteps.length > 0 
            ? formSteps.find( 
                ( item: any ) => item.attributes.slug === 'ethical_statements' )?.attributes.subSteps 
            : [];
        setSubSteps( subStepsList );
        if ( subStepsList && subStepsList.length > 0 ) {
            subStepsList.map( ( subStep: any ) =>  {
                subStep.slug === 'clinical_trial_registration_code' && 
                    setClinicalTrialRegistrationCodeStep( true );
                subStep.slug === 'ethical_approval' && setEthicalApprovalStep( true );
                subStep.slug === 'informed_consent' && setInformedConsentStep( true );
                subStep.slug === 'data_availability' && setDataAvailabilityStep( true );
            });
        } 
    }, [formSteps]);
    useEffect( () => {
        dispatch( formValidator( true ) );
    }, []);
    useEffect(() => {
        if ( subSteps?.length > 0 ) {
            const requiredFields: any = [];
            subSteps.map( ( item: any ) =>  {
                item.required && requiredFields.push( item.slug ); 
            });
            const formIsValid = Object.entries( formData ).every( ( [ key, value ] ) =>  {
                const step: any = value;
                return requiredFields.includes( key ) ? step.text !== '' : true 
            });
            dispatch( formValidator( formIsValid ) );
        }
    }, [formData]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
            dispatch( handleLoading( true ) );
            let isAllowed = false;
            try {
                await updateStepDataTrigger( 
                    { 
                        url: getClinicalTrialRegistrationCodeDataFromApi, 
                        data: formData.clinicalTrialRegistrationCode
                    } 
                );
                await updateStepDataTrigger( 
                    { 
                        url: getEthicalApprovalDataFromApi, 
                        data: formData.ethicalApproval 
                    } 
                );
                await updateStepDataTrigger( 
                    { 
                        url: getInformedConsentDataFromApi, 
                        data: formData.informedConsent 
                    } 
                );
                await updateStepDataTrigger( 
                    { 
                        url: getDataAvailabilityDataFromApi, 
                        data: formData.dataAvailability 
                    } 
                );
                isAllowed = true;
            } catch ( error ) {
                console.error("Error while submitting form:", error);
            }

            return isAllowed;
        }
    }));

    return (
        isLoading
            ? <StepPlaceholder/>
            :
                <div id="ethical-statements" className="tab">
                    <h3 className="mb-4 text-shadow-white">Ethical Statements</h3>
                    <Alert severity="info" className="mb-4">
                        {   
                            ( 
                                clinicalTrialRegistrationCodeStep && 
                                clinicalTrialRegistrationCodeStepGuide !== undefined 
                            ) &&     
                                <div className="mb-2 fs-7">
                                    { 
                                        ReactHtmlParser( 
                                            clinicalTrialRegistrationCodeStepGuide 
                                        ) 
                                    }
                                </div>
                        }
                        {   
                            ( 
                                ethicalApprovalStep && 
                                ethicalApprovalStepGuide !== undefined 
                                ) &&     
                                    <div className="mb-2 fs-7">
                                        { 
                                            ReactHtmlParser( 
                                                ethicalApprovalStepGuide 
                                            ) 
                                        }
                                    </div>
                        }
                        {
                            ( 
                                informedConsentStep && 
                                informedConsentStepGuide !== undefined 
                            ) &&     
                                <div className="mb-2 fs-7">
                                    { 
                                        ReactHtmlParser( 
                                            informedConsentStepGuide 
                                        ) 
                                    }
                                </div>
                        }
                        {
                            ( 
                                dataAvailabilityStep && 
                                dataAvailabilityStepGuide !== undefined 
                            ) &&     
                                <div className="mb-2 fs-7">
                                    { 
                                        ReactHtmlParser( 
                                            dataAvailabilityStepGuide 
                                        ) 
                                    }
                                </div>
                        }
                    </Alert>
                    {
                        ( 
                            subSteps?.length > 0 && 
                            subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'clinical_trial_registration_code' 
                            ) 
                        ) &&
                            <div id="clinical-trial-registration-code">
                                {
                                    ( 
                                        clinicalTrialRegistrationCodeDetails !== undefined && 
                                        clinicalTrialRegistrationCodeDetails !== '' 
                                    ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( clinicalTrialRegistrationCodeDetails ) }
                                        </Alert>
                                }
                                <FormControl 
                                    className={`mb-3 ${ 
                                        subSteps.find( 
                                            ( subStep: any ) => 
                                                subStep.slug === 'clinical_trial_registration_code' ).required 
                                                    ? ' required' 
                                                    : '' 
                                        }`
                                    }
                                    error={ 
                                        isVerified && 
                                        formData?.clinicalTrialRegistrationCode?.text === '' 
                                    }
                                >
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
                                        value={ 
                                            formData?.clinicalTrialRegistrationCode?.text 
                                                ? formData?.clinicalTrialRegistrationCode?.text 
                                                : '' 
                                        }
                                        onChange={( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    clinicalTrialRegistrationCode: { text: event.target.value } 
                                                }
                                            ))
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData?.clinicalTrialRegistrationCode?.text === '' 
                                        ) 
                                        && 
                                            <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText> 
                                    }
                                </FormControl>
                            </div>
                    }
                    {
                        ( 
                            subSteps?.length > 0 && 
                            subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'ethical_approval' 
                            ) 
                        ) &&
                            <div id="ethical-approval">
                                {
                                    ( 
                                        ethicalApprovalDetails !== undefined && 
                                        ethicalApprovalDetails !== '' 
                                    ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( ethicalApprovalDetails ) }
                                        </Alert>
                                }
                                <FormControl 
                                    className={`mb-3 ${ 
                                        subSteps.find( 
                                            ( subStep: any ) => 
                                                subStep.slug === 'ethical_approval' 
                                        ).required 
                                            ? ' required' 
                                            : '' 
                                        }`
                                    }
                                    error={ 
                                        isVerified && 
                                        formData?.ethicalApproval?.text === ''
                                    }
                                >
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
                                        value={ 
                                            formData?.ethicalApproval?.text 
                                            ? formData?.ethicalApproval?.text 
                                            : '' 
                                        }
                                        onChange={ ( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    ethicalApproval: { text: event.target.value } 
                                                }
                                            ))
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData?.ethicalApproval?.text === ''
                                        ) && 
                                            <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText> 
                                    }
                                </FormControl>
                            </div>
                    }
                    {
                        ( 
                            subSteps?.length > 0 && 
                            subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'informed_consent' 
                            ) 
                        ) &&
                            <div id="informed-consent">
                                {
                                    ( 
                                        informedConsentDetails !== undefined && 
                                        informedConsentDetails !== '' 
                                    ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( informedConsentDetails ) }
                                        </Alert>
                                }
                                <FormControl 
                                    className={`mb-3 ${ 
                                        subSteps.find( 
                                            ( subStep: any ) => subStep.slug === 'informed_consent' ).required 
                                                ? ' required' 
                                                : '' 
                                        }`
                                    }
                                    error={ 
                                        isVerified && 
                                        formData?.informedConsent?.text === ''
                                    }
                                >
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
                                        value={ 
                                            formData?.informedConsent?.text 
                                                ? formData?.informedConsent?.text 
                                                : '' 
                                        }
                                        onChange={( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    informedConsent: { text: event.target.value } 
                                                }
                                            ))
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData?.informedConsent?.text === '' 
                                        ) && 
                                            <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText>
                                    }
                                </FormControl>
                            </div>
                    }
                    {
                        ( 
                            subSteps?.length > 0 && 
                            subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'data_availability' 
                            ) 
                        ) &&
                            <div id="data-availability">
                                {
                                    ( 
                                        dataAvailabilityDetails !== undefined && 
                                        dataAvailabilityDetails !== '' 
                                    ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( dataAvailabilityDetails ) }
                                        </Alert>
                                }
                                <FormControl 
                                    className={`mb-3 ${ 
                                        subSteps.find( 
                                            ( subStep: any ) => subStep.slug === 'data_availability' ).required 
                                                ? ' required' 
                                                : '' 
                                        }`
                                    }
                                    error={ 
                                        isVerified && 
                                        formData?.dataAvailability?.text === '' 
                                    }
                                >
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
                                        value={ 
                                            formData?.dataAvailability?.text 
                                                ? formData?.dataAvailability?.text 
                                                : '' 
                                        }
                                        onChange={( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    dataAvailability: { text: event.target.value } 
                                                }
                                            )) 
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData?.dataAvailability?.text === ''
                                        ) && 
                                            <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText>
                                    }
                                </FormControl>
                            </div>
                    }
                </div>
    );
});

EthicalStatementsStep.displayName = 'EthicalStatementsStep';

export default EthicalStatementsStep;