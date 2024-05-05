import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import Textarea from '@/components/elements/textarea'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
    Alert,
    Box,
    Typography,
    Stack
} from '@mui/material'
import { formValidator } from '@/app/features/wizard/wizardSlice'
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
        const isVerified = useAppSelector((state: any) => state.wizard.isVerified);
        const formSteps = useAppSelector((state: any) => state.wizard.formSteps);
        const [subSteps, setSubSteps]: any = useState<object[]>();
        const [clinicalTrialRegistrationCodeStep, setClinicalTrialRegistrationCodeStep] = useState(false);
        const [ethicalApprovalStep, setEthicalApprovalStep] = useState(false);
        const [informedConsentStep, setInformedConsentStep] = useState(false);
        const [dataAvailabilityStep, setDataAvailabilityStep] = useState(false);
        const [formData, setFormData] = useState({
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
            (item: any) =>
            (
                item.attributes?.step_slug === 'clinical_trial_registration_code' &&
                item.attributes?.status === 'invalid'
            ))?.attributes?.detail || '';
        const ethicalApprovalDetails = props.screeningDetails?.find(
            (item: any) =>
            (
                item.attributes?.step_slug === 'ethical_approval' &&
                item.attributes?.status === 'invalid'
            ))?.attributes?.detail || '';
        const informedConsentDetails = props.screeningDetails?.find(
            (item: any) =>
            (
                item.attributes?.step_slug === 'informed_consent' &&
                item.attributes?.status === 'invalid'
            ))?.attributes?.detail || '';
        const dataAvailabilityDetails = props.screeningDetails?.find(
            (item: any) =>
            (
                item.attributes?.step_slug === 'data_availability' &&
                item.attributes?.status === 'invalid'
            ))?.attributes?.detail || '';
        const getClinicalTrialRegistrationCodeDataFromApi =
            `${props.workflowId}/clinical_trial_registration_code`;
        const getEthicalApprovalDataFromApi =
            `${props.workflowId}/ethical_approval`;
        const getInformedConsentDataFromApi =
            `${props.workflowId}/informed_consent`;
        const getDataAvailabilityDataFromApi =
            `${props.workflowId}/data_availability`;
        const getClinicalTrialRegistrationCodeDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}clinical_trial_registration_code`;
        const getEthicalApprovalDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}ethical_approval`;
        const getInformedConsentDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}informed_consent`;
        const getDataAvailabilityDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}data_availability`;
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        const {
            data: clinicalTrialRegistrationCodeStepGuide,
            isLoading: clinicalTrialRegistrationCodeStepGuideIsLoading
        } = useGetStepGuideQuery(getClinicalTrialRegistrationCodeDictionaryFromApi);
        const {
            data: clinicalTrialRegistrationCodeStepData,
            isLoading: clinicalTrialRegistrationCodeStepDataIsLoading
        } = useGetStepDataQuery(getClinicalTrialRegistrationCodeDataFromApi);
        const {
            data: ethicalApprovalStepGuide,
            isLoading: ethicalApprovalStepGuideIsLoading
        } = useGetStepGuideQuery(getEthicalApprovalDictionaryFromApi);
        const {
            data: ethicalApprovalStepData,
            isLoading: ethicalApprovalStepDataIsLoading
        } = useGetStepDataQuery(getEthicalApprovalDataFromApi);
        const {
            data: informedConsentStepGuide,
            isLoading: informedConsentStepGuideIsLoading
        } = useGetStepGuideQuery(getInformedConsentDictionaryFromApi);
        const {
            data: informedConsentStepData,
            isLoading: informedConsentStepDataIsLoading
        } = useGetStepDataQuery(getInformedConsentDataFromApi);
        const {
            data: dataAvailabilityStepGuide,
            isLoading: dataAvailabilityStepGuideIsLoading
        } = useGetStepGuideQuery(getDataAvailabilityDictionaryFromApi);
        const {
            data: dataAvailabilityStepData,
            isLoading: dataAvailabilityStepDataIsLoading
        } = useGetStepDataQuery(getDataAvailabilityDataFromApi);
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
                (prevState: any) => (
                    {
                        ...prevState,
                        clinicalTrialRegistrationCode: clinicalTrialRegistrationCodeStepData
                    }
                )
            );
        }, [clinicalTrialRegistrationCodeStepData]);
        useEffect(() => {
            ethicalApprovalStepData && setFormData(
                (prevState: any) => (
                    {
                        ...prevState,
                        ethicalApproval: ethicalApprovalStepData
                    }
                )
            );
        }, [ethicalApprovalStepData]);
        useEffect(() => {
            informedConsentStepData && setFormData(
                (prevState: any) => (
                    {
                        ...prevState,
                        informedConsent: informedConsentStepData
                    }
                )
            );
        }, [informedConsentStepData]);
        useEffect(() => {
            dataAvailabilityStepData && setFormData(
                (prevState: any) => (
                    {
                        ...prevState,
                        dataAvailability: dataAvailabilityStepData
                    }
                )
            );
        }, [dataAvailabilityStepData]);
        useEffect(() => {
            const subStepsList = formSteps.length > 0
                ? formSteps.find(
                    (item: any) => item.attributes.slug === 'ethical_statements')?.attributes.subSteps
                : [];
            setSubSteps(subStepsList);
            if (subStepsList && subStepsList.length > 0) {
                subStepsList.map((subStep: any) => {
                    subStep.slug === 'clinical_trial_registration_code' &&
                        setClinicalTrialRegistrationCodeStep(true);
                    subStep.slug === 'ethical_approval' && setEthicalApprovalStep(true);
                    subStep.slug === 'informed_consent' && setInformedConsentStep(true);
                    subStep.slug === 'data_availability' && setDataAvailabilityStep(true);
                });
            }
        }, [formSteps]);
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        useEffect(() => {
            if (subSteps?.length > 0) {
                const requiredFields: any = [];
                subSteps.map((item: any) => {
                    item.required && requiredFields.push(item.slug);
                });
                const formIsValid = Object.entries(formData).every(([key, value]) => {
                    const step: any = value;
                    return requiredFields.includes(key) ? step.text !== '' : true
                });
                dispatch(formValidator(formIsValid));
            }
        }, [formData]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
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
                } catch (error) {
                    console.error("Error while submitting form:", error);
                }

                return isAllowed;
            }
        }));
        const handleChange = (value: string, fieldName: string) => {
            setFormData((prevState: any) => (
                {
                    ...prevState,
                    [fieldName]: { text: value }
                }
            ));
        }

        return (
            isLoading
                ? <StepPlaceholder />
                :
                <Box>
                    <Typography variant="h3" mb={2}>
                        Ethical Statements
                    </Typography>
                    <Alert color="info" sx={{ mb: 3, p: 2 }}>
                        <Stack direction="column">
                            {
                                (
                                    clinicalTrialRegistrationCodeStep &&
                                    clinicalTrialRegistrationCodeStepGuide !== undefined
                                ) &&
                                <Box mb={1} fontSize={12}>
                                    {
                                        ReactHtmlParser(
                                            clinicalTrialRegistrationCodeStepGuide
                                        )
                                    }
                                </Box>
                            }
                            {
                                (
                                    ethicalApprovalStep &&
                                    ethicalApprovalStepGuide !== undefined
                                ) &&
                                <Box mb={1} fontSize={12}>
                                    {
                                        ReactHtmlParser(
                                            ethicalApprovalStepGuide
                                        )
                                    }
                                </Box>
                            }
                            {
                                (
                                    informedConsentStep &&
                                    informedConsentStepGuide !== undefined
                                ) &&
                                <Box mb={1} fontSize={12}>
                                    {
                                        ReactHtmlParser(
                                            informedConsentStepGuide
                                        )
                                    }
                                </Box>
                            }
                            {
                                (
                                    dataAvailabilityStep &&
                                    dataAvailabilityStepGuide !== undefined
                                ) &&
                                <Box mb={1} fontSize={12}>
                                    {
                                        ReactHtmlParser(
                                            dataAvailabilityStepGuide
                                        )
                                    }
                                </Box>
                            }
                        </Stack>
                    </Alert>
                    {
                        (
                            subSteps?.length > 0 &&
                            subSteps.find(
                                (subStep: any) => subStep.slug === 'clinical_trial_registration_code'
                            )
                        ) &&
                        <Box>
                            {
                                (
                                    clinicalTrialRegistrationCodeDetails !== undefined &&
                                    clinicalTrialRegistrationCodeDetails !== ''
                                ) &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {
                                        ReactHtmlParser(clinicalTrialRegistrationCodeDetails)
                                    }
                                </Alert>
                            }
                            <Textarea
                                label="clinical trial registration code"
                                value={
                                    formData?.clinicalTrialRegistrationCode?.text
                                        ? formData?.clinicalTrialRegistrationCode?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="clinicalTrialRegistrationCode"
                                required={subSteps.find((subStep: any) => subStep.slug === 'clinical_trial_registration_code').required}
                                error={
                                    isVerified &&
                                    formData.clinicalTrialRegistrationCode?.text === ''
                                }
                            />
                        </Box>
                    }
                    {
                        (
                            subSteps?.length > 0 &&
                            subSteps.find(
                                (subStep: any) => subStep.slug === 'ethical_approval'
                            )
                        ) &&
                        <Box>
                            {
                                (
                                    ethicalApprovalDetails !== undefined &&
                                    ethicalApprovalDetails !== ''
                                ) &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {
                                        ReactHtmlParser(ethicalApprovalDetails)
                                    }
                                </Alert>
                            }
                            <Textarea
                                label="ethical approval"
                                value={
                                    formData?.ethicalApproval?.text
                                        ? formData?.ethicalApproval?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="ethicalApproval"
                                required={subSteps.find((subStep: any) => subStep.slug === 'ethical_approval').required}
                                error={
                                    isVerified &&
                                    formData.ethicalApproval?.text === ''
                                }
                            />
                        </Box>
                    }
                    {
                        (
                            subSteps?.length > 0 &&
                            subSteps.find(
                                (subStep: any) => subStep.slug === 'informed_consent'
                            )
                        ) &&
                        <Box>
                            {
                                (
                                    informedConsentDetails !== undefined &&
                                    informedConsentDetails !== ''
                                ) &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {
                                        ReactHtmlParser(informedConsentDetails)
                                    }
                                </Alert>
                            }
                            <Textarea
                                label="informed consent"
                                value={
                                    formData?.informedConsent?.text
                                        ? formData?.informedConsent?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="informedConsent"
                                required={subSteps.find((subStep: any) => subStep.slug === 'informed_consent').required}
                                error={
                                    isVerified &&
                                    formData.informedConsent?.text === ''
                                }
                            />
                        </Box>
                    }
                    {
                        (
                            subSteps?.length > 0 &&
                            subSteps.find(
                                (subStep: any) => subStep.slug === 'data_availability'
                            )
                        ) &&
                        <Box>
                            {
                                (
                                    dataAvailabilityDetails !== undefined &&
                                    dataAvailabilityDetails !== ''
                                ) &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {
                                        ReactHtmlParser(dataAvailabilityDetails)
                                    }
                                </Alert>
                            }
                            <Textarea
                                label="data availability"
                                value={
                                    formData?.dataAvailability?.text
                                        ? formData?.dataAvailability?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="dataAvailability"
                                required={subSteps.find((subStep: any) => subStep.slug === 'data_availability').required}
                                error={
                                    isVerified &&
                                    formData.dataAvailability?.text === ''
                                }
                            />
                        </Box>
                    }
                </Box>
        );
    });

EthicalStatementsStep.displayName = 'EthicalStatementsStep';

export default EthicalStatementsStep;