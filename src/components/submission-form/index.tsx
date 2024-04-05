import { useRef, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Breadcrumbs, Typography, Link } from '@mui/material'
import { prevStep, nextStep, handleIsVerified } from '@features/wizard/wizardSlice'
import { useGetTypesQuery } from '@/app/services/steps/types'
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
import { useGetScreeningQuery } from '@/app/services/apiSlice'
import { Workflow, Wizard, Type } from '@/app/services/types'

interface ChildComponentProps {
    submitForm: () => Promise<boolean>;
}

const SubmissionForm = ( 
    props: {  
        workflow: Workflow
    }
) => {
    const zeroChildRef = useRef<ChildComponentProps>( null );
    const agreementChildRef = useRef<ChildComponentProps>( null );
    const typesChildRef = useRef<ChildComponentProps>( null );
    const sectionChildRef = useRef<ChildComponentProps>( null );
    const authorChildRef = useRef<ChildComponentProps>( null );
    const keywordsChildRef = useRef<ChildComponentProps>( null );
    const classificationsChildRef = useRef<ChildComponentProps>( null );
    const abstractChildRef = useRef<ChildComponentProps>( null );
    const editorChildRef = useRef<ChildComponentProps>( null );
    const reviewersChildRef = useRef<ChildComponentProps>( null );
    const filesChildRef = useRef<ChildComponentProps>( null );
    const commentChildRef = useRef<ChildComponentProps>( null );
    const regionChildRef = useRef<ChildComponentProps>( null );
    const authorContributionChildRef = useRef<ChildComponentProps>( null );
    const footnotesChildRef = useRef<ChildComponentProps>( null );
    const financialDisclosureChildRef = useRef<ChildComponentProps>( null );
    const twitterChildRef = useRef<ChildComponentProps>( null );
    const ethicalStatementsChildRef = useRef<ChildComponentProps>( null );
    const dispatch = useAppDispatch();
    const wizard: Wizard = useAppSelector( ( state: any ) => state.wizard );
    const [ screeningDetails, setScreeningDetails ] = useState<object[]>([]);
    const getAllTypesFromApi = 
        `journal/type?filter[document_type_journals.journal_id]=${ 
            props.workflow.attributes.journal_id 
        }`;
    const { data: types } : { data: Type[] } = useGetTypesQuery( getAllTypesFromApi );
    let details = '';
    if ( props.workflow.document_id && props.workflow.document_id !== '' ) {
        const getScreeningFromApi = `screening/${ props.workflow.document_id }?include=step`;
        const { data: screeningDetails } = useGetScreeningQuery( getScreeningFromApi );
        setScreeningDetails( screeningDetails );
        details = screeningDetails?.find( ( item: any ) => 
            ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    }
    const stepDataApiUrl = `${ props.workflow.id || process.env.DEFAULT_WORKFLOW_ID }/${ wizard.formStep || 'agreement' }`;
    const stepGuideApiUrl = `${ process.env.DICTIONARY_API_URL }${ wizard.formStep || 'agreement' }`;
    
    const handleNextStep = async () => {
        const activeStepRef = wizard.formStep === 'revision_message'
            ? zeroChildRef
            : wizard.formStep === 'agreement'
            ? agreementChildRef
            : wizard.formStep === 'types'
            ? typesChildRef
            : wizard.formStep === 'section'
            ? sectionChildRef
            : wizard.formStep === 'authors'
            ? authorChildRef
            : wizard.formStep === 'keywords'
            ? keywordsChildRef
            : wizard.formStep === 'classifications'
            ? classificationsChildRef
            : wizard.formStep === 'abstract'
            ? abstractChildRef
            : wizard.formStep === 'editors'
            ? editorChildRef
            : wizard.formStep === 'reviewers'
            ? reviewersChildRef
            : wizard.formStep === 'files'
            ? filesChildRef
            : wizard.formStep === 'comments'
            ? commentChildRef
            : wizard.formStep === 'region'
            ? regionChildRef
            : wizard.formStep === 'authors_contribution'
            ? authorContributionChildRef
            : wizard.formStep === 'financial_disclosure'
            ? financialDisclosureChildRef
            : wizard.formStep === 'twitter'
            ? twitterChildRef
            : wizard.formStep === 'footnotes'
            ? footnotesChildRef
            : wizard.formStep === 'ethical_statements'
            ? ethicalStatementsChildRef
            : null;
        !wizard.isVerified && dispatch( handleIsVerified() );
        if ( wizard.isFormValid ) {
            try {
                await activeStepRef?.current?.submitForm().then( ( isAllowed ) => {
                    if ( isAllowed ) {
                        dispatch( nextStep( wizard.isFormValid ) );
                    }
                });
            } catch ( error ) {
                console.error("Error while submitting form:", error);
            }
        }
    }
    useEffect( () => {
        if ( props.workflow.journal?.attributes?.services?.goftino ) {
            const script = document.createElement('script');
            script.src = process.env.CHAT_PLUGIN_URL || '';
            script.async = true;
            document.head.appendChild(script);
            return () => {;
                document.head.removeChild(script);
            };
        }
    }, [props.workflow.journal]);
    // useQuery({
    //     queryKey: ['screening'],
    //     queryFn:  async () => {
    //         const getScreeningFromApi = 
    //             `${ 
    //                 process.env.API_URL 
    //             }/screening/${ 
    //                 wizard.workflow?.document_id 
    //             }?include=step`;
    //         const response = await dispatch( getScreening( getScreeningFromApi ) );
    //         const payload = response.payload;
    //         dispatch( setScreening( payload ) );

    //         return payload;
    //     },
    //     enabled: (
    //         wizard.workflow?.document_id !== undefined && 
    //         wizard.workflow?.document_id !== '' && 
    //         wizard.workflow?.document_id !== null 
    //     ),
    //     gcTime: wizard.cacheDuration
    // });

    return (
        <div className="wizard mb-4">
            <DialogComponent/>
            <FlashMessage className="z-index-1050"/>
            <div className="d-flex align-items-center justify-content-between px-md-4">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link 
                        underline="hover" 
                        color="inherit" 
                        href="/" 
                        className="d-flex align-items-center">
                        <i className="fa-duotone fa-home fs-7 me-1"></i>
                        <span>Home</span>
                    </Link>
                    <Typography 
                        color="text.primary" 
                        className="d-flex align-items-center">
                            Submission
                    </Typography>
                </Breadcrumbs>
            </div>
            <WizardNavigation hasTypeDetermined={ wizard.hasType } />
            <div className="d-flex align-items-start" style={{clear: 'both'}}>
                <WizardOutline hasTypeDetermined={ wizard.hasType } />
                <div className="wizard-steps tab-container p-4 p-md-5 mb-5 mb-md-0 rounded-double bg-white flex-fill position-relative overflow-hidden">
                    <div className="custom-shape-divider-top">
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
                    </div>
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end justify-content-between z-index-2">
                        <div>
                            {
                                ( props.workflow?.attributes?.storage?.types?.doc_type !== undefined && props.workflow?.attributes?.storage?.types?.doc_type !== '' ) &&
                                    <p className="fs-7">
                                        <label className="me-2 fw-bold">Document Type:</label>
                                        <span className="text-muted">
                                            { ( props.workflow?.attributes?.storage?.types?.doc_type && types !== undefined )
                                                && types.find( 
                                                    ( item: any ) => parseInt( item.id ) === parseInt( props.workflow?.attributes?.storage?.types?.doc_type ) 
                                                    )?.attributes?.title 
                                            }
                                        </span>
                                    </p>
                            }
                            {
                                ( props.workflow?.attributes?.storage?.base_doc_id !== undefined && props.workflow?.attributes?.storage?.base_doc_id !== '' ) &&
                                    <p className="fs-7">
                                        <label className="me-2 fw-bold">Manuscript ID:</label>
                                        <span className="text-muted">
                                            { props.workflow?.attributes?.storage?.base_doc_id }
                                        </span>
                                    </p>
                            }
                            {
                                ( props.workflow?.attributes?.storage?.types?.manuscript_title !== undefined && props.workflow?.attributes?.storage?.types?.manuscript_title !== '' ) &&
                                    <p className="fs-7">
                                        <label className="me-2 fw-bold">Manuscript Title:</label>
                                        <span className="text-muted">
                                            { props.workflow?.attributes?.storage?.types?.manuscript_title }
                                        </span>
                                    </p>
                            }
                            {
                                ( props.workflow?.attributes?.storage?.revision !== undefined && props.workflow?.attributes?.storage?.revision !== '' ) &&
                                    <p className="fs-7">
                                        <label className="me-2 fw-bold">Revision:</label>
                                        <span className="text-muted">
                                            { props.workflow?.attributes?.storage?.revision }
                                        </span>
                                    </p>
                            }
                        </div>
                        <div>
                            { wizard.formSteps.length > 0 && 
                                <p className="mb-0 text-muted fs-7">Step <b className="text-success">
                                    { 
                                        wizard.formSteps.findIndex( 
                                            ( item: any ) => item?.attributes?.slug?.includes( wizard.formStep || process.env.DEFAULT_STEP ) 
                                        ) + 1 
                                    } </b> of <b>{ wizard.formSteps.length }</b>
                                </p>
                            }
                        </div>
                    </div>
                    <hr className="mt-2 mb-4"/>
                    {
                        wizard.formStep === 'revision_message' && 
                            <ZeroStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl.replace(/revission_message/g, 'zero'), stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                ref={ zeroChildRef }
                            />
                    }
                    {
                        wizard.formStep === 'agreement' &&
                            <AgreementStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={props.workflow.id}
                                ref={ agreementChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'types' && 
                            <TypesStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl.replace(/types/g, 'type'), stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={props.workflow.id}
                                types= { types }
                                ref={ typesChildRef }
                            />
                    }
                    {
                        wizard.formStep === 'section' && 
                            <SectionStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={props.workflow.id}
                                ref={ sectionChildRef }
                            />
                    }
                    {
                        wizard.formStep === 'authors' && 
                            <AuthorsStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={props.workflow.id}
                                ref={ authorChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'keywords' && 
                            <KeywordsStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={props.workflow.id}
                                ref={ keywordsChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'classifications' && 
                            <ClassificationsStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                ref={ classificationsChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'abstract' && 
                            <AbstractStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={ props.workflow.id }
                                ref={ abstractChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'editors' && 
                            <EditorStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl.replace(/editors/g, 'editor'), stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={ props.workflow.id }
                                ref={ editorChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'reviewers' && 
                            <ReviewersStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                ref={ reviewersChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'files' && 
                            <FilesStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                workflowId={ props.workflow.id }
                                ref={ filesChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'comments' && 
                            <CommentStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                ref={ commentChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'region' && 
                            <RegionStep
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details } 
                                ref={ regionChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'financial_disclosure' && 
                            <FinancialDisclosureStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                ref={ financialDisclosureChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'twitter' && 
                            <Twitter 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                                ref={ twitterChildRef } 
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
                                workflowId={ props.workflow.id }
                                screeningDetails={ screeningDetails }
                                ref={ footnotesChildRef } 
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
                                workflowId={ props.workflow.id }
                                screeningDetails={ screeningDetails }
                                ref={ ethicalStatementsChildRef } 
                            />
                    }
                    {
                        wizard.formStep === 'build' && 
                            <BuildStep 
                                apiUrls={ { stepDataApiUrl: stepDataApiUrl, stepGuideApiUrl: stepGuideApiUrl } } 
                                details={ details }
                            />
                    }
                    { 
                        wizard.formStep !== 'build' &&
                            <div className="d-flex align-items-center justify-content-end mt-4">
                                <button
                                    type="button" 
                                    id="previous-step" 
                                    className={`button btn_secondary me-2 
                                        ${ wizard.formStep === wizard.formSteps[0]?.attributes.slug ? 'd-none' : '' }`} 
                                    onClick={ () =>dispatch( prevStep() )}>
                                    Back
                                </button>
                                <button
                                    type="button"
                                    id="next-step"
                                    className={`button btn_primary`} 
                                    onClick={ () => handleNextStep() }>
                                    Next
                                </button>
                            </div>
                    } 
                </div>
            </div>
        </div>
    );
}

export default SubmissionForm;