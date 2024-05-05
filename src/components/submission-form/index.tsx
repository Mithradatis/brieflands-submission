import WizardNavigation from '@/components/partials/navigation'
import WizardOutline from '@/components/partials/outline'
import AgreementStep from '@/components/submission-form/steps/agreement/'
import TypesStep from '@/components/submission-form/steps/types'
import SectionStep from '@/components/submission-form/steps/section'
import AuthorsStep from '@/components/submission-form/steps/authors'
import KeywordsStep from '@/components/submission-form/steps/keywords'
import ClassificationsStep from '@/components/submission-form/steps/classifications'
import AbstractStep from '@/components/submission-form/steps/abstract'
import EditorStep from '@/components/submission-form/steps/editor'
import ReviewersStep from '@/components/submission-form/steps/reviewers'
import FilesStep from '@/components/submission-form/steps/files'
import CommentStep from '@/components/submission-form/steps/comments'
import RegionStep from '@/components/submission-form/steps/region'
import FootnotesStep from '@/components/submission-form/steps/footnotes'
import EthicalStatementsStep from '@/components/submission-form/steps/ethical-statements'
import FinancialDisclosureStep from '@/components/submission-form/steps/financial-disclosure'
import Twitter from '@/components/submission-form/steps/twitter'
import BuildStep from '@/components/submission-form/steps/build'
import DialogComponent from '@/components/dialog/dialog'
import FlashMessage from '@/components/snackbar/snackbar'
import ZeroStep from '@/components/submission-form/steps/zero'
import { useRef, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { prevStep, nextStep, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { useGetTypesQuery } from '@/app/services/steps/types'
import { useLazyGetScreeningQuery } from '@/app/services/apiSlice'
import { Workflow, Wizard, Type } from '@/app/services/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/pro-duotone-svg-icons'
import { styled } from '@mui/material'
import {
    Box,
    Breadcrumbs,
    Button,
    Container,
    Divider,
    Link,
    Stack,
    Typography
} from '@mui/material'

interface ChildComponentProps {
    submitForm: () => Promise<boolean>;
}

const SubmissionForm = (
    props: {
        workflow: Workflow
    }
) => {
    const zeroChildRef = useRef<ChildComponentProps>(null);
    const agreementChildRef = useRef<ChildComponentProps>(null);
    const typesChildRef = useRef<ChildComponentProps>(null);
    const sectionChildRef = useRef<ChildComponentProps>(null);
    const authorChildRef = useRef<ChildComponentProps>(null);
    const keywordsChildRef = useRef<ChildComponentProps>(null);
    const classificationsChildRef = useRef<ChildComponentProps>(null);
    const abstractChildRef = useRef<ChildComponentProps>(null);
    const editorChildRef = useRef<ChildComponentProps>(null);
    const reviewersChildRef = useRef<ChildComponentProps>(null);
    const filesChildRef = useRef<ChildComponentProps>(null);
    const commentChildRef = useRef<ChildComponentProps>(null);
    const regionChildRef = useRef<ChildComponentProps>(null);
    const authorContributionChildRef = useRef<ChildComponentProps>(null);
    const footnotesChildRef = useRef<ChildComponentProps>(null);
    const financialDisclosureChildRef = useRef<ChildComponentProps>(null);
    const twitterChildRef = useRef<ChildComponentProps>(null);
    const ethicalStatementsChildRef = useRef<ChildComponentProps>(null);
    const dispatch = useAppDispatch();
    const wizard: Wizard = useAppSelector((state: any) => state.wizard);
    const [screeningDetails, setScreeningDetails] = useState<any[]>([]);
    const [getScreeningDetailsTrigger] = useLazyGetScreeningQuery();
    const getAllTypesFromApi =
        `journal/type?filter[document_type_journals.journal_id]=${props.workflow.attributes.journal_id
        }`;
    const { data: types }: { data: Type[] } = useGetTypesQuery(getAllTypesFromApi);
    let details = '';
    if (props.workflow.document_id && props.workflow.document_id !== '') {
        const getScreeningFromApi = `screening/${props.workflow.document_id}?include=step`;
        const { data: screeningData } = getScreeningDetailsTrigger(getScreeningFromApi);
        setScreeningDetails(screeningData);
        details = screeningDetails?.find((item: any) =>
        (
            item.attributes?.step_slug === wizard.formStep &&
            item.attributes?.status === 'invalid'
        ))?.attributes?.detail || '';
    }
    const stepDataApiUrl = `${props.workflow.id ||
        process.env.DEFAULT_WORKFLOW_ID}/${wizard.formStep ||
        'agreement'
        }`;
    const stepGuideApiUrl = `${process.env.DICTIONARY_API_URL}${wizard.formStep || 'agreement'}`;
    const handleNextStep = async () => {
        const activeStepRef = () => {
            switch (wizard.formStep) {
                case 'revision_message':
                    return zeroChildRef;
                case 'agreement':
                    return agreementChildRef;
                case 'types':
                    return typesChildRef;
                case 'section':
                    return sectionChildRef;
                case 'authors':
                    return authorChildRef;
                case 'keywords':
                    return keywordsChildRef;
                case 'classifications':
                    return classificationsChildRef;
                case 'abstract':
                    return abstractChildRef;
                case 'editors':
                    return editorChildRef;
                case 'reviewers':
                    return reviewersChildRef;
                case 'files':
                    return filesChildRef;
                case 'comments':
                    return commentChildRef;
                case 'region':
                    return regionChildRef;
                case 'authors_contribution':
                    return authorContributionChildRef;
                case 'financial_disclosure':
                    return financialDisclosureChildRef;
                case 'twitter':
                    return twitterChildRef;
                case 'footnotes':
                    return footnotesChildRef;
                case 'ethical_statements':
                    return ethicalStatementsChildRef;
                default:
                    return null;
            }
        };
        !wizard.isVerified && dispatch(handleIsVerified());
        if (wizard.isFormValid) {
            try {
                await (activeStepRef() ?? null)?.current?.submitForm().then((isAllowed) => {
                    if (isAllowed) {
                        dispatch(nextStep(wizard.isFormValid));
                    }
                });
            } catch (error) {
                console.error("Error while submitting form:", error);
            }
        }
    }
    useEffect(() => {
        if (props.workflow.journal?.attributes?.services?.goftino) {
            const script = document.createElement('script');
            script.src = process.env.CHAT_PLUGIN_URL || '';
            script.async = true;
            document.head.appendChild(script);
            return () => {
                document.head.removeChild(script);
            };
        }
    }, [props.workflow.journal]);
    const TopBackground = styled('div')({
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        opacity: .5,
        '& svg': {
            position: 'relative',
            display: 'block',
            width: 'calc(195% + 1.3px)',
            height: '150px',
        },
        '& .shape-fill': {
            fill: '#f7f7f7'
        }
    });

    return (
        <Container className="wizard" sx={{ mb: 2 }}>
            <DialogComponent />
            <FlashMessage sx={{ zIndex: 1050 }} />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
                <Breadcrumbs aria-label="breadcrumb" sx={{ p: 2 }}>
                    <Link underline="hover" href="/" display="flex" alignItems="baseline">
                        <FontAwesomeIcon
                            icon={faHouse}
                            fontSize={14}
                            style={{ marginRight: '.25rem' }}
                        />
                        <Typography>
                            Home
                        </Typography>
                    </Link>
                    <Typography>
                        Submission
                    </Typography>
                </Breadcrumbs>
            </Stack>
            <WizardNavigation hasTypeDetermined={wizard.hasType} />
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="center"
                sx={{ clear: 'both' }}
            >
                <WizardOutline hasTypeDetermined={wizard.hasType} />
                <Box
                    p={{ xs: 2, md: 5 }}
                    overflow="hidden"
                    position="relative"
                    sx={{
                        position: 'relative',
                        backgroundColor: 'white',
                        borderRadius: { xs: '.75rem', md: '1.5rem' },
                        border: '1px solid white',
                        width: { xs: '100%', sm: 725 },
                        boxShadow: '3px 3px 5px rgba(87, 147, 153, .5), -3px -3px 5px rgb(143, 181, 185, .5), inset 20px 20px 60px rgb(220, 220, 220)',
                    }}
                >
                    <TopBackground sx={{ zIndex: 0 }}>
                        <svg
                            data-name="Layer 1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none">
                            <path
                                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                className="shape-fill">
                            </path>
                        </svg>
                    </TopBackground>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems="flex-end"
                        justifyContent="space-between"
                        sx={{ position: 'relative', zIndex: 1 }}
                    >
                        <Box>
                            {
                                (
                                    props.workflow?.attributes?.storage?.types?.doc_type !== undefined &&
                                    props.workflow?.attributes?.storage?.types?.doc_type !== ''
                                ) &&
                                <Box>
                                    <Typography variant="title-sm" sx={{ pr: .5 }}>
                                        Document Type:
                                    </Typography>
                                    <Typography variant="body-sm">
                                        {
                                            (
                                                props.workflow?.attributes?.storage?.types?.doc_type &&
                                                types !== undefined
                                            ) &&
                                            types.find(
                                                (item: any) =>
                                                    parseInt(item.id) === parseInt(
                                                        props.workflow?.attributes?.storage?.types?.doc_type
                                                    )
                                            )?.attributes?.title
                                        }
                                    </Typography>
                                </Box>
                            }
                            {
                                (
                                    props.workflow?.attributes?.storage?.base_doc_id !== undefined &&
                                    props.workflow?.attributes?.storage?.base_doc_id !== ''
                                ) &&
                                <Box>
                                    <Typography variant="title-sm" sx={{ pr: .5 }}>
                                        Manuscript ID:
                                    </Typography>
                                    <Typography variant="body-sm">
                                        {
                                            props.workflow?.attributes?.storage?.base_doc_id
                                        }
                                    </Typography>
                                </Box>
                            }
                            {
                                (
                                    props.workflow?.attributes?.storage?.types?.manuscript_title !== undefined &&
                                    props.workflow?.attributes?.storage?.types?.manuscript_title !== ''
                                ) &&
                                <Box>
                                    <Typography variant="title-sm" sx={{ pr: .5 }}>
                                        Manuscript Title:
                                    </Typography>
                                    <Typography variant="body-sm">
                                        {
                                            props.workflow?.attributes?.storage?.types?.manuscript_title
                                        }
                                    </Typography>
                                </Box>
                            }
                            {
                                (
                                    props.workflow?.attributes?.storage?.revision !== undefined &&
                                    props.workflow?.attributes?.storage?.revision !== ''
                                ) &&
                                <Box>
                                    <Typography variant="title-sm" sx={{ pr: .5 }}>
                                        Revision:
                                    </Typography>
                                    <Typography variant="body-sm">
                                        {props.workflow?.attributes?.storage?.revision}
                                    </Typography>
                                </Box>
                            }
                        </Box>
                        <Box display={{ xs: 'none', md: 'flex' }}>
                            {wizard.formSteps.length > 0 &&
                                <Stack direction="row" alignItems="center">
                                    <Typography
                                        component="span"
                                        fontSize={12}
                                        color="muted"
                                        variant="body-sm"
                                    >
                                        Step
                                    </Typography>
                                    <Typography
                                        px={.5}
                                        fontWeight="bold"
                                        variant="success"
                                        fontSize={14}
                                    >
                                        {
                                            wizard.formSteps.findIndex(
                                                (item: any) =>
                                                    item?.attributes?.slug?.includes(
                                                        wizard.formStep || process.env.DEFAULT_STEP
                                                    )
                                            ) + 1
                                        }
                                    </Typography>
                                    <Typography color="muted" variant="body-sm">of</Typography>
                                    <Typography
                                        px={.5}
                                        component="span"
                                        fontWeight="bold"
                                        fontSize={14}
                                    >
                                        {
                                            wizard.formSteps.length
                                        }
                                    </Typography>
                                </Stack>
                            }
                        </Box>
                    </Stack>
                    <Divider sx={{ mt: 1, mb: 2 }} />
                    {
                        wizard.formStep === 'revision_message' &&
                        <ZeroStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl.replace(/revission_message/g, 'zero'),
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            ref={zeroChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'agreement' &&
                        <AgreementStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={agreementChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'types' &&
                        <TypesStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl.replace(/types/g, 'type'),
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            types={types}
                            ref={typesChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'section' &&
                        <SectionStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={sectionChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'authors' &&
                        <AuthorsStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={authorChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'keywords' &&
                        <KeywordsStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={keywordsChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'classifications' &&
                        <ClassificationsStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            ref={classificationsChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'abstract' &&
                        <AbstractStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={abstractChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'editors' &&
                        <EditorStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl.replace(/editors/g, 'editor'),
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={editorChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'reviewers' &&
                        <ReviewersStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={reviewersChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'files' &&
                        <FilesStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            workflowId={props.workflow.id}
                            ref={filesChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'comments' &&
                        <CommentStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            ref={commentChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'region' &&
                        <RegionStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            ref={regionChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'financial_disclosure' &&
                        <FinancialDisclosureStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            ref={financialDisclosureChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'twitter' &&
                        <Twitter
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                            ref={twitterChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'footnotes' &&
                        <FootnotesStep
                            apiUrls={
                                {
                                    stepDataApiUrl: stepDataApiUrl.replace(/\/footnotes/g, ''),
                                    stepGuideApiUrl: stepGuideApiUrl.replace(/.footnotes/g, '')
                                }
                            }
                            workflowId={props.workflow.id}
                            screeningDetails={screeningDetails}
                            ref={footnotesChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'ethical_statements' &&
                        <EthicalStatementsStep
                            apiUrls={
                                {
                                    stepDataApiUrl: stepDataApiUrl.replace(/\/ethical_statements/g, ''),
                                    stepGuideApiUrl: stepGuideApiUrl.replace(/.ethical_statements/g, '')
                                }
                            }
                            workflowId={props.workflow.id}
                            screeningDetails={screeningDetails}
                            ref={ethicalStatementsChildRef}
                        />
                    }
                    {
                        wizard.formStep === 'build' &&
                        <BuildStep
                            apiUrls={{
                                stepDataApiUrl: stepDataApiUrl,
                                stepGuideApiUrl: stepGuideApiUrl
                            }}
                            details={details}
                        />
                    }
                    {
                        wizard.formStep !== 'build' &&
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" mt={4}>
                            <Button
                                sx={{ mr: 2, backgroundColor: 'transparent' }}
                                id="previous-step"
                                className={`button btn_secondary
                                        ${wizard.formStep === wizard.formSteps[0]?.attributes.slug ? 'hidden' : ''}`}
                                onClick={() => dispatch(prevStep())}>
                                Back
                            </Button>
                            <Button
                                id="next-step"
                                className="button btn_primary"
                                onClick={() => handleNextStep()}>
                                Next
                            </Button>
                        </Stack>
                    }
                </Box>
            </Stack>
        </Container>
    );
}

export default SubmissionForm;