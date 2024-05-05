import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import Textarea from '@/components/elements/textarea'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import {
    Alert,
    Box,
    FormControl,
    FormLabel,
    FormHelperText,
    Stack,
    Typography
} from '@mui/material'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'

const FootnotesStep = forwardRef(
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
        const [subSteps, setSubSteps]: any = useState([]);
        const [authorsContributionStep, setAuthorsContributionStep] = useState(false);
        const [fundingSupportStep, setFundingSupportStep] = useState(false);
        const [conflictOfInterestsStep, setConflictOfInterestsStep] = useState(false);
        const [formData, setFormData] = useState({
            authorsContribution: {
                text: ''
            },
            fundingSupport: {
                text: ''
            },
            conflictOfInterests: {
                text: ''
            }
        });
        const authorsContributionDetails = props.screeningDetails?.find((item: any) =>
        (
            item.attributes?.step_slug === 'authors_contribution' &&
            item.attributes?.status === 'invalid'
        ))?.attributes?.detail || '';
        const fundingSupportDetails = props.screeningDetails?.find((item: any) =>
        (
            item.attributes?.step_slug === 'funding_support' &&
            item.attributes?.status === 'invalid'
        ))?.attributes?.detail || '';
        const conflictOfInterestsDetails = props.screeningDetails?.find((item: any) =>
        (
            item.attributes?.step_slug === 'conflict_of_interests' &&
            item.attributes?.status === 'invalid'
        ))?.attributes?.detail || '';
        const getAuthorsContributionDataFromApi =
            `${props.workflowId}/authors_contribution`;
        const getFundingSupportDataFromApi =
            `${props.workflowId}/funding_support`;
        const getConflictOfInterestsDataFromApi =
            `${props.workflowId}/conflict_of_interests`;
        const getAuthorsContributionDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}authors_contribution`;
        const getFundingSupportDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}funding_support`;
        const getConflictOfInterestsDictionaryFromApi =
            `${process.env.DICTIONARY_API_URL}conflict_of_interests`;
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        const {
            data: authorsContributionStepGuide,
            isLoading: authorsContributionStepGuideIsLoading
        } = useGetStepGuideQuery(getAuthorsContributionDictionaryFromApi);
        const {
            data: authorsContributionStepData,
            isLoading: authorsContributionStepDataIsLoading
        } = useGetStepDataQuery(getAuthorsContributionDataFromApi);
        const {
            data: fundingSupportStepGuide,
            isLoading: fundingSupportStepGuideIsLoading
        } = useGetStepGuideQuery(getFundingSupportDictionaryFromApi);
        const {
            data: fundingSupportStepData,
            isLoading: fundingSupportStepDataIsLoading
        } = useGetStepDataQuery(getFundingSupportDataFromApi);
        const {
            data: conflictOfInterestsStepGuide,
            isLoading: conflictOfInterestsStepGuideIsLoading
        } = useGetStepGuideQuery(getConflictOfInterestsDictionaryFromApi);
        const {
            data: conflictOfInterestsStepData,
            isLoading: conflictOfInterestsStepDataIsLoading
        } = useGetStepDataQuery(getConflictOfInterestsDataFromApi);
        const isLoading: boolean = (
            (
                authorsContributionStep &&
                authorsContributionStepGuideIsLoading &&
                authorsContributionStepDataIsLoading &&
                typeof authorsContributionStepGuide !== 'string'
            ) || (
                fundingSupportStep &&
                fundingSupportStepGuideIsLoading &&
                fundingSupportStepDataIsLoading &&
                typeof fundingSupportStepGuide !== 'string'
            ) || (
                conflictOfInterestsStep &&
                conflictOfInterestsStepGuideIsLoading &&
                conflictOfInterestsStepDataIsLoading &&
                typeof conflictOfInterestsStepGuide !== 'string'
            )
        );
        useEffect(() => {
            authorsContributionStepData && setFormData(
                (prevState: any) => (
                    {
                        ...prevState,
                        authorsContribution: authorsContributionStepData
                    }
                )
            );
        }, [authorsContributionStepData]);
        useEffect(() => {
            fundingSupportStepData && setFormData(
                (prevState: any) => (
                    {
                        ...prevState,
                        fundingSupport: fundingSupportStepData
                    }
                )
            );
        }, [fundingSupportStepData]);
        useEffect(() => {
            conflictOfInterestsStepData && setFormData(
                (prevState: any) => (
                    {
                        ...prevState,
                        conflictOfInterests: conflictOfInterestsStepData
                    }
                )
            );
        }, [conflictOfInterestsStepData]);
        useEffect(() => {
            const subStepsList = formSteps.length > 0
                ? formSteps?.find(
                    (item: any) => item.attributes.slug === 'footnotes')?.attributes?.subSteps
                : [];
            setSubSteps(subStepsList);
            if (subStepsList && subStepsList.length > 0) {
                subStepsList.map((subStep: any) => {
                    subStep.slug === 'authors_contribution' && setAuthorsContributionStep(true);
                    subStep.slug === 'funding_support' && setFundingSupportStep(true);
                    subStep.slug === 'conflict_of_interests' && setConflictOfInterestsStep(true);
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
                            url: getAuthorsContributionDataFromApi,
                            data: formData.authorsContribution
                        }
                    )
                    await updateStepDataTrigger(
                        {
                            url: getFundingSupportDataFromApi,
                            data: formData.fundingSupport
                        }
                    );
                    await updateStepDataTrigger(
                        {
                            url: getConflictOfInterestsDataFromApi,
                            data: formData.conflictOfInterests
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
                <Box id="footnotes" className="relative z-10">
                    <Typography variant="h3" mb={2}>
                        Footnotes
                    </Typography>
                    <Alert color="info" sx={{ mb: 3, p: 2 }}>
                        <Stack direction="column">
                            {
                                (subSteps?.length > 0 && subSteps.find(
                                    (subStep: any) => subStep.slug === 'authors_contribution') &&
                                    authorsContributionStepGuide !== undefined) &&
                                <Box mb={1} fontSize={12}>
                                    {ReactHtmlParser(authorsContributionStepGuide)}
                                </Box>
                            }
                            {
                                (subSteps?.length > 0 && subSteps.find(
                                    (subStep: any) => subStep.slug === 'funding_support') &&
                                    fundingSupportStepGuide !== undefined) &&
                                <Box mb={1} fontSize={12}>
                                    {ReactHtmlParser(fundingSupportStepGuide)}
                                </Box>
                            }
                            {
                                (subSteps?.length > 0 && subSteps.find(
                                    (subStep: any) => subStep.slug === 'conflict_of_interests') &&
                                    conflictOfInterestsStepGuide !== undefined) &&
                                <Box mb={1} fontSize={12}>
                                    {
                                        ReactHtmlParser(conflictOfInterestsStepGuide)
                                    }
                                </Box>
                            }
                        </Stack>
                    </Alert>
                    {
                        (
                            subSteps?.length > 0 && subSteps.find(
                                (subStep: any) => subStep.slug === 'authors_contribution')
                        ) &&
                        <Box>
                            {
                                (
                                    authorsContributionDetails !== undefined &&
                                    authorsContributionDetails !== ''
                                ) &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {
                                        ReactHtmlParser(authorsContributionDetails)
                                    }
                                </Alert>
                            }
                            <Textarea
                                label="author&apos;s contribution"
                                value={
                                    formData?.authorsContribution?.text
                                        ? formData?.authorsContribution?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="authorsContribution"
                                required={subSteps.find((subStep: any) => subStep.slug === 'authors_contribution').required}
                                error={
                                    isVerified &&
                                    formData.authorsContribution?.text === ''
                                }
                            />
                        </Box>
                    }
                    {
                        (
                            subSteps?.length > 0 &&
                            subSteps.find((subStep: any) => subStep.slug === 'funding_support')
                        ) &&
                        <Box>
                            {
                                (fundingSupportDetails !== undefined && fundingSupportDetails !== '') &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {ReactHtmlParser(fundingSupportDetails)}
                                </Alert>
                            }
                            <Textarea
                                label="funding/support"
                                value={
                                    formData?.fundingSupport?.text
                                        ? formData?.fundingSupport?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="fundingSupport"
                                required={subSteps.find((subStep: any) => subStep.slug === 'funding_support').required}
                                error={
                                    isVerified &&
                                    formData.fundingSupport?.text === ''
                                }
                            />
                        </Box>
                    }
                    {
                        (
                            subSteps?.length > 0 &&
                            subSteps.find((subStep: any) => subStep.slug === 'conflict_of_interests')
                        ) &&
                        <Box>
                            {
                                (
                                    conflictOfInterestsDetails !== undefined &&
                                    conflictOfInterestsDetails !== ''
                                ) &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {ReactHtmlParser(conflictOfInterestsDetails)}
                                </Alert>
                            }
                            <Textarea
                                label="conflict of interests"
                                value={
                                    formData?.conflictOfInterests?.text
                                        ? formData?.conflictOfInterests?.text
                                        : ''
                                }
                                onChange={handleChange}
                                fieldName="conflictOfInterests"
                                required={subSteps.find((subStep: any) => subStep.slug === 'conflict_of_interests').required}
                                error={
                                    isVerified &&
                                    formData.conflictOfInterests?.text === ''
                                }
                            />
                        </Box>
                    }
                </Box>
        );
    });

FootnotesStep.displayName = 'FootnotesStep';

export default FootnotesStep;