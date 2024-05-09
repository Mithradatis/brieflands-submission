import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { formValidator, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { useGetRegionsQuery } from '@/app/services/steps/region'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'
import {
    Alert,
    Autocomplete,
    Box,
    FormLabel,
    FormControl,
    FormHelperText,
    TextField,
    Typography
} from '@mui/material'

const RegionStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const isVerified = useAppSelector((state: any) => state.wizard.isVerified);
        const [formData, setFormData] = useState({
            id: ''
        });
        const { 
            data: regions, 
            isLoading: regionsIsLoading 
        } = useGetRegionsQuery();
        const { 
            data: stepGuide, 
            isLoading: stepGuideIsLoading 
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const { 
            data: stepData, 
            isLoading: stepDataIsLoading 
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (
            regionsIsLoading || 
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
            const formIsValid = formData?.id !== null && formData?.id !== '';
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
                <Box id="region" className="relative z-10">
                    <Typography variant="h3" mb={2}>
                        Region
                    </Typography>
                    {
                        (
                            props.details !== undefined &&
                            props.details !== ''
                        ) &&
                        <Alert color="error" sx={{ mb: 3, p: 2 }}>
                            {
                                ReactHtmlParser(props.details)
                            }
                        </Alert>
                    }
                    {
                        (
                            typeof stepGuide === 'string' &&
                            stepGuide.trim() !== ''
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
                        className="mb-3"
                        error={
                            isVerified &&
                            formData?.id === ''
                        }
                    >
                        <FormLabel>
                            <Typography variant="title-sm">
                                Region
                            </Typography>
                        </FormLabel>
                        {regions ? (
                            <Autocomplete
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        placeholder="Choose one…"
                                    />
                                )}
                                options={
                                    Array.isArray(regions)
                                        ? regions.map(
                                            (item: any) => {
                                                return item.attributes?.title || ''
                                            }
                                        ) : []
                                }
                                value={
                                    (formData?.id !== '' && regions.length > 0)
                                        ? regions
                                            .find(
                                                (item: any) => formData?.id === item.id
                                            )?.attributes?.title
                                        : null
                                }
                                onChange={(event, value) => {
                                    isVerified && dispatch(handleIsVerified());
                                    setFormData(
                                        {
                                            id: regions.find(
                                                (item: any) => item.attributes.title === value)?.id || ''
                                        }
                                    )
                                }}
                            />
                        ) : (
                            <Box>Loading regions...</Box>
                        )}
                        {
                            (
                                isVerified &&
                                formData?.id === ''
                            ) &&
                            <FormHelperText>
                                <Typography 
                                    variant="body-sm" 
                                    color="error"
                                >
                                    Please select a region
                                </Typography>
                            </FormHelperText>
                        }
                    </FormControl>
                </Box>
        );
    });

RegionStep.displayName = 'RegionStep';

export default RegionStep;