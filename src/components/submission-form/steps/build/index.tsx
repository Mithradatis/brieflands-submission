import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useLazyGetFinalAgreementGuideQuery } from '@/app/services/steps/build'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { handleSnackbarOpen } from '@features/snackbar/snackbarSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faDownload } from '@fortawesome/pro-duotone-svg-icons'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import {
    formValidator,
    loadStep,
    prevStep,
    handleIsVerified,
    Wizard
} from '@/app/features/wizard/wizardSlice'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Link,
    Stack,
    styled,
    Typography
} from '@mui/material'

export type Build = {
    terms: boolean;
    word_count?: string;
    standard_word_count?: string;
    word_count_include_in_fee?: string;
    prices?: any;
    final_message?: string;
    journal_agreement_message?: string;
    files?: {
        full?: string;
    };
}

const DashboardStat = styled(Box)({
    position: 'relative',
    backgroundColor: '#096bde',
    borderRadius: 10,
    '.dashboard-stat-icon': {
        fontSize: '5rem',
        position: 'absolute',
        zIndex: 0,
        top: '-.5rem',
        left: '-.5rem'
    },
    '.dashboard-stat-footer': {
        position: 'absolute',
        zIndex: 1,
        borderRadius: '0 0 12px 12px',
        backgroundColor: '#0a54ab',
        width: '100%',
        bottom: 0,
        left: 0
    }
});

const BuildStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const wizard: Wizard = useAppSelector((state: any) => state.wizard);
        const [getFinalAgreementTrigger] = useLazyGetFinalAgreementGuideQuery();
        const {
            data: stepGuide,
            isLoading: stepGuideIsLoading
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepData,
            isLoading: stepDataIsLoading,
            isError,
            error
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        if (isError) {
            let unfinishedStep = error?.data?.data?.step;
            const footnotes = [
                'authors_contribution',
                'funding_support',
                'conflict_of_interests'
            ];
            const ethicalStatements = [
                'clinical_trial_registration_code',
                'ethical_approval',
                'informed_consent',
                'data_availability'
            ];
            if (footnotes.includes(unfinishedStep)) {
                unfinishedStep = 'footnotes';
            }
            if (ethicalStatements.includes(unfinishedStep)) {
                unfinishedStep = 'ethical_statements';
            }
            dispatch(loadStep(unfinishedStep));
            dispatch(handleSnackbarOpen({ severity: 'error', message: error?.data?.data?.message }));
        }
        const isLoading: boolean = (
            stepGuideIsLoading ||
            stepDataIsLoading ||
            typeof stepGuide !== 'string'
        );
        const [finalAgreementGuide, setFinalAgreementGuide] = useState('');
        const [formData, setFormData] = useState<Build>({
            terms: true
        });
        const finishWorkflowUrl =
            `${process.env.SUBMISSION_API_URL}/${wizard.workflowId}/finish`;
        useEffect(() => {
            if (stepData) {
                setFormData(stepData);
            }
        }, [stepData]);
        useEffect(() => {
            const formIsValid = formData?.terms;
            dispatch(formValidator(formIsValid));
        }, [wizard.formStep, formData]);
        useEffect(() => {
            let getFinalAgreementDictionary = '';
            if (wizard.journal?.attributes?.shopping_status) {
                getFinalAgreementDictionary =
                    `${process.env.API_URL}/dictionary/get/journal.submission.final.agreement.apc`;
            } else {
                getFinalAgreementDictionary =
                    `${process.env.API_URL}/dictionary/get/journal.submission.final.agreement`;
            }
            setFinalAgreementGuide(getFinalAgreementTrigger(getFinalAgreementDictionary));
        }, [wizard.journal]);

        return (
            isLoading
                ? <StepPlaceholder />
                :
                <Box>
                    <Typography variant="h3" mb={2}>
                        Build
                    </Typography>
                    {
                        (props.details && props.details !== '') &&
                        <Alert severity="error" className="mb-4">
                            {ReactHtmlParser(props.details)}
                        </Alert>
                    }
                    {stepGuide &&
                        <Alert severity="info" className="mb-4">
                            {ReactHtmlParser(stepGuide)}
                        </Alert>
                    }
                    <Stack direction="column" alignItems="start" justifyContent="center" py={3}>
                        {
                            formData?.files?.full !== '' &&
                            <Box width={50 + '%'}>
                                <Link
                                    href={formData?.files?.full}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <DashboardStat color="primary">
                                        <CardContent sx={{ display: 'flex', minHeight: 120 }}>
                                            <Box overflow="hidden" position="relative">
                                                <FontAwesomeIcon
                                                    className="dashboard-stat-icon"
                                                    color="white"
                                                    opacity={.5}
                                                    fontSize={42}
                                                    icon={faFilePdf}
                                                />
                                                <Typography
                                                    component="span"
                                                    color="white"
                                                    fontSize={30}
                                                    pl={10}
                                                    pt={5}
                                                    mt={2}
                                                >
                                                    Full File
                                                </Typography>
                                            </Box>
                                            <Box px={2} py={.5} className="dashboard-stat-footer">
                                                <FontAwesomeIcon
                                                    color="white"
                                                    icon={faDownload}
                                                />
                                                <Typography variant="body-sm" pl={.25} color="white">
                                                    Get File
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </DashboardStat>
                                </Link>
                            </Box>
                        }
                    </Stack>
                    <Alert color="info" sx={{ mb: 3 }}>
                        {
                            ReactHtmlParser(finalAgreementGuide)
                        }
                        <Divider sx={{ my: 1 }} />
                        {
                            formData?.standard_word_count &&
                            <Box>
                                <Typography component="span" variant="body-sm">
                                    Standard word count is:
                                </Typography>
                                <Typography component="span" variant="title-sm" px={1}>
                                    {
                                        formData?.standard_word_count
                                    }
                                </Typography>
                            </Box>
                        }
                        {
                            formData?.word_count &&
                            <Box>
                                <Typography component="span" variant="body-sm">
                                    Word count(Total) of manuscript is about:
                                </Typography>
                                <Typography component="span" variant="title-sm" px={1}>
                                    {
                                        formData?.word_count
                                    }
                                </Typography>
                            </Box>
                        }
                        {
                            (
                                wizard.journal?.attributes?.shopping_status === 'active' &&
                                formData?.word_count_include_in_fee
                            ) &&
                            <Box>
                                <Typography component="span" variant="body-sm">
                                    Word count(include in fee) of manuscript is about:
                                </Typography>
                                <Typography component="span" variant="title-sm" px={1}>
                                    {
                                        formData?.word_count_include_in_fee
                                    }
                                </Typography>
                            </Box>
                        }
                        {
                            (
                                wizard.journal?.attributes?.shopping_status === 'active' &&
                                formData?.prices &&
                                Object.keys(formData?.prices).length > 0
                            ) &&
                            <Box>
                                <Typography component="span" variant="body-sm">
                                    Invoice amount(VAT included) will be:
                                </Typography>
                                {
                                    Object.entries(
                                        formData?.prices['Acceptance Fee']).map(
                                            ([currency, value]) => (
                                                <Typography 
                                                    component="span" 
                                                    variant="title-sm" 
                                                    key={currency} 
                                                    px={1}
                                                >
                                                    {` ${value} ${currency}`}
                                                </Typography>
                                            )
                                        )
                                }
                            </Box>
                        }
                    </Alert>
                    <Box 
                        component="form"
                        mb={3}
                    >
                        <FormControl>
                            <FormControlLabel
                                required
                                control={
                                    <Checkbox
                                        name="terms"
                                        id="terms"
                                        checked={formData?.terms || false}
                                        onChange={event => {
                                            !wizard.isVerified && dispatch(handleIsVerified());
                                            setFormData(
                                                {
                                                    terms: formData?.terms
                                                }
                                            )
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body-sm" color="muted">
                                        {
                                            formData?.journal_agreement_message
                                        }
                                    </Typography>
                                }
                            />
                            {
                                (
                                    wizard.isVerified &&
                                    !formData?.terms
                                )
                                &&
                                <Typography variant="body-sm" color="error">
                                    Please check the agreement to continue
                                </Typography>
                            }
                        </FormControl>
                    </Box>
                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                        {
                            wizard.formStep !== wizard.formSteps[0]?.attributes.title &&
                            <Button
                                sx={{ mr: 2 }}
                                className="button btn_secondary"
                                onClick={() => dispatch(prevStep())}
                            >
                                Back
                            </Button>
                        }
                        <Button
                            className={`button btn_primary`}
                            onClick={() => {
                                if (formData?.terms) {
                                    dispatch(handleDialogOpen({
                                        actions: { finishWorkflow: finishWorkflowUrl },
                                        data: '',
                                        dialogTitle: 'Finish Submission',
                                        dialogContent: { content: formData?.final_message },
                                        dialogAction: 'finish-submission'
                                    }
                                    ));
                                } else {
                                    setFormData({ terms: false });
                                }
                            }}
                        >
                            Finish
                        </Button>
                    </Stack>
                </Box>
        );
    });

BuildStep.displayName = 'BuildStep';

export default BuildStep;