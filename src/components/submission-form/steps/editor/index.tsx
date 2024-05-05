import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useAppDispatch } from '@/store/store'
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { useGetEditorsQuery } from '@/app/services/steps/editor'
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
    TextField,
    Typography
} from '@mui/material'

const EditorStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string,
            workflowId: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const [formData, setFormData] = useState({
            id: ''
        });
        const getAllTypesFromApi = `${process.env.SUBMISSION_API_URL}/${props.workflowId}/editor/get_all`;
        const { data: editors, isLoading: editorsIsLoading } = useGetEditorsQuery(getAllTypesFromApi);
        const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (editorsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string');
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        useEffect(() => {
            if (stepData) {
                setFormData({
                    id: stepData.id
                });
            }
        }, [stepData]);
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
                <Box>
                    <Typography variant="h3" mb={2}>
                        Editor
                    </Typography>
                    {
                        (props.details !== undefined && props.details !== '') &&
                        <Alert color="error" sx={{ mb: 3, p: 2 }}>
                            {
                                ReactHtmlParser(props.details)
                            }
                        </Alert>
                    }
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                {
                                    ReactHtmlParser(stepGuide)
                                }
                            </Alert>
                        )
                    }
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormLabel className="fw-bold mb-1">
                            Editor
                        </FormLabel>
                        {
                            editors ? (
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
                                        Array.isArray(editors)
                                            ? editors.map(
                                                item => {
                                                    return `${item.attributes.first_name
                                                        } ${item.attributes.middle_name
                                                        } ${item.attributes.last_name
                                                        }` || ''
                                                }
                                            ) : []
                                    }
                                    value={
                                        (formData?.id !== '' && editors.length > 0)
                                            ? editors
                                                .find((item: any) => formData?.id === item.id)?.name
                                            : null
                                    }
                                    onChange={(event, value) => {
                                        setFormData({
                                            id: editors.find(
                                                (item: any) => `${item.attributes.first_name
                                                    } ${item.attributes.middle_name
                                                    } ${item.attributes.last_name
                                                    }` === value)?.id || ''
                                        }
                                        )
                                    }}
                                />
                            ) : (
                                <Typography component="p">
                                    Loading editors...
                                </Typography>
                            )
                        }
                    </FormControl>
                </Box>
        );
    });

EditorStep.displayName = 'EditorStep';

export default EditorStep;