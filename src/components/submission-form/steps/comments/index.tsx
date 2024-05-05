import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import Textarea from '@/components/elements/textarea'
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch } from '@/store/store'
import { Alert, Box, Typography } from '@mui/material'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'

const CommentStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string
        },
        ref
    ) => {
        const [formData, setFormData] = useState({
            text: ''
        });
        const dispatch = useAppDispatch();
        const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string');
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        useEffect(() => {
            if (stepData) {
                setFormData(stepData);
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
        const handleChange = (value: string) => {
            setFormData((prevState: any) => (
                {
                    ...prevState,
                    text: value
                }
            ));
        }

        return (
            isLoading
                ? <StepPlaceholder />
                :
                <Box id="comments" className="relative z-10">
                    <Typography variant="h3" mb={2}>
                        Comment
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
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                {
                                    ReactHtmlParser(stepGuide)
                                }
                            </Alert>
                        )
                    }
                    <Textarea
                        label="comment"
                        value={formData?.text || ''}
                        onChange={handleChange}
                    />
                </Box>
        );
    });

CommentStep.displayName = 'CommentStep';

export default CommentStep;