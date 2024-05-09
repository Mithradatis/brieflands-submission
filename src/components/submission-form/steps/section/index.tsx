import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { formValidator, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { useGetSectionsQuery } from '@/app/services/steps/section'
import { type sectionsListItem } from '@/app/services/types/section'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'
import {
    Alert,
    Autocomplete,
    Box,
    FormControl,
    FormLabel,
    FormHelperText,
    Typography,
    TextField
} from '@mui/material'

const SectionStep = forwardRef(
    (
        props: {
            apiUrls: { 
                stepDataApiUrl: string, 
                stepGuideApiUrl: string 
            },
            details: string,
            workflowId: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const isVerified = useAppSelector((state: any) => state.wizard.isVerified);
        const [formData, setFormData] = useState({
            id: 0,
        });
        const getAllTypesFromApi = 'journal/section';
        const {
            data: sections,
            isLoading: sectionsIsLoading
        } = useGetSectionsQuery(getAllTypesFromApi);
        const {
            data: stepGuide,
            isLoading: stepGuideIsLoading
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepData,
            isLoading: stepDataIsLoading
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (
            sectionsIsLoading ||
            stepGuideIsLoading ||
            stepDataIsLoading ||
            typeof stepGuide !== 'string'
        );
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        useEffect(() => {
            if (stepData) {
                setFormData({ id: stepData });
            }
        }, [stepData]);
        useEffect(() => {
            const formIsValid = formData?.id !== null && formData?.id !== 0;
            dispatch(formValidator(formIsValid));
        }, [formData]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = false;
                try {
                    await updateStepDataTrigger(
                        {
                            url: props.apiUrls.stepDataApiUrl,
                            data: formData
                        }
                    );
                    isAllowed = true;
                } catch (error) {
                    console.error("Error while submitting form:", error);
                }

                return isAllowed;
            }
        }));

        return (
            isLoading
                ? <StepPlaceholder />
                :
                <Box
                    position="relative"
                    zIndex={1000}
                    id="section"
                    className="relative z-10"
                >
                    <Typography variant="h3" mb={2}>
                        Section
                    </Typography>
                    {
                        (
                            props.details !== undefined && props.details !== ''
                        ) &&
                        <Alert color="error" sx={{ mb: 3, p: 2 }}>
                            {
                                ReactHtmlParser(props.details)
                            }
                        </Alert>
                    }
                    {
                        (
                            typeof stepGuide === 'string' && stepGuide.trim() !== ''
                        ) && (
                            <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                {
                                    ReactHtmlParser(stepGuide)
                                }
                            </Alert>
                        )
                    }
                    <FormControl
                        fullWidth
                        required
                        error={
                            isVerified &&
                            formData?.id === 0
                        }
                    >
                        <FormLabel sx={{ mb: .5 }}>
                            <Typography variant="title-sm">
                                Section
                            </Typography>
                        </FormLabel>
                        <Autocomplete
                            key="section"
                            color="neutral"
                            size="small"
                            placeholder="Choose one…"
                            disabled={false}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                />
                            )}
                            options={
                                Array.isArray(sections)
                                    ? sections.map(
                                        item => {
                                            return item.attributes?.title || ''
                                        }
                                    ) : []
                            }
                            value={
                                (
                                    formData && formData?.id &&
                                    formData?.id !== 0 &&
                                    sections.length > 0
                                )
                                    ? sections.find(
                                        (item: sectionsListItem) =>
                                            formData?.id.toString() === item.id.toString()
                                    )?.attributes?.title
                                    : null
                            }
                            onChange={(event, value) => {
                                !isVerified && dispatch(handleIsVerified());
                                setFormData(
                                    {
                                        id: sections.find(
                                            (item: sectionsListItem) =>
                                                item.attributes.title === value)?.id || 0
                                    }
                                )
                            }}
                        />
                        {
                            (
                                isVerified && formData?.id === 0
                            ) &&
                            <FormHelperText>
                                <Typography variant="body-sm" color="error">
                                    You should choose a section.
                                </Typography>
                            </FormHelperText>
                        }
                    </FormControl>
                </Box>
        );
    });

SectionStep.displayName = 'SectionStep';

export default SectionStep;