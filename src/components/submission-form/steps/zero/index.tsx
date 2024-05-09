import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import { useAppDispatch } from '@/store/store'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert, Box, Typography } from '@mui/material'

const ZeroStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const { 
            data: stepGuide, 
            isLoading: stepGuideIsLoading 
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const { 
            data: stepData, 
            isLoading: stepDataIsLoading 
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = stepGuideIsLoading || stepDataIsLoading;
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = true;

                return isAllowed;
            }
        }));

        return (
            isLoading
                ? <StepPlaceholder />
                : <Box>
                    <Typography variant="h3" mb={2}>
                        Revise/Revission Message
                    </Typography>
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert color="info" className="mb-4">
                                {
                                    ReactHtmlParser(stepGuide)
                                }
                            </Alert>
                        )
                    }
                    <Alert color="info" className="mb-4 break-word">
                        {stepData?.revise_message !== undefined
                            && ReactHtmlParser(stepData?.revise_message)
                        }
                        {stepData?.screening !== undefined &&
                            <table className="fs-7 table table-bordered table-stripped table-responsive">
                                <thead>
                                    <tr>
                                        <th>Step Title</th>
                                        <th>Status</th>
                                        <th>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stepData?.screening.map((row: any, index: number) =>
                                            <tr key={`row-${index}`}>
                                                <td>{row.step_title}</td>
                                                <td>{row.status}</td>
                                                <td>{ReactHtmlParser(row.detail)}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                    </Alert>
                </Box>
        );
    });

ZeroStep.displayName = 'ZeroStep';

export default ZeroStep;