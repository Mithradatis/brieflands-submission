'use client'

import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getScreening } from '@/app/api/client'
import { wizardState, prevStep, nextStep, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { getDocumentTypes } from '@/app/api/types'
import WizardNavigation from '@/app/components/wizard-navigation'
import WizardOutline from '@/app/components/wizard-outline'
import AgreementStep from '@/app/components/submission-form/agreement-step'
import TypesStep from '@/app/components/submission-form/types-step'
import SectionStep from '@/app/components/submission-form/section-step'
import AuthorsStep from '@/app/components/submission-form/authors-step'
import KeywordsStep from '@/app/components/submission-form/keywords-step'
import ClassificationsStep from '@/app/components/submission-form/classifications-step'
import AbstractStep from '@/app/components/submission-form/abstract-step'
import EditorStep from '@/app/components/submission-form/editor-step'
import ReviewersStep from '@/app/components/submission-form/reviewers-step'
import FilesStep from '@/app/components/submission-form/files-step'
import CommentStep from '@/app/components/submission-form/comment-step'
import RegionStep from '@/app/components/submission-form/region-step'
import AuthorContributionStep from '@/app/components/submission-form/author-contribution-step'
import FinancialDisclosureStep from '@/app/components/submission-form/finantial-disclosure-step'
import ClinicalTrialRegistrationCodeStep from '@/app/components/submission-form/clinical-trial-registration-code-step'
import EthicalApprovalStep from '@/app/components/submission-form/ethical-approval-step'
import Twitter from '@/app/components/submission-form/twitter-step'
import ConflictOfInterestStep from '@/app/components/submission-form/conflict-of-interests-step'
import InformedConsentStep from '@/app/components/submission-form/informed-consent-step'
import FundingSupportStep from '@/app/components/submission-form/funding-support-step'
import DataReproducibilityStep from '@/app/components/submission-form/data-reproducibility-step'
import BuildStep from '@/app/components/submission-form/build-step'
import DialogComponent from '@/app/components/dialog/dialog'
import FlashMessage from '@/app/components/snackbar/snackbar'
import ZeroStep from '@/app/components/submission-form/zero-step'

interface ChildComponentProps {
    submitForm: () => void;
}

const SubmissionForm = () => {
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
    const financialDisclosureChildRef = useRef<ChildComponentProps>( null );
    const clinicalTrialRegistrationCodeChildRef = useRef<ChildComponentProps>( null );
    const ethicalApprovalChildRef = useRef<ChildComponentProps>( null );
    const twitterChildRef = useRef<ChildComponentProps>( null );
    const conflictOfInterestChildRef = useRef<ChildComponentProps>( null );
    const informedConsentChildRef = useRef<ChildComponentProps>( null );
    const fundingSupportChildRef = useRef<ChildComponentProps>( null );
    const dataReproducibilityChildRef = useRef<ChildComponentProps>( null );
    const dispatch:any = useDispatch();
    const wizard = useSelector( wizardState );
    const handleNextStep = () => {
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
            : wizard.formStep === 'clinical_trial_registration_code'
            ? clinicalTrialRegistrationCodeChildRef
            : wizard.formStep === 'ethical_approval'
            ? ethicalApprovalChildRef
            : wizard.formStep === 'twitter'
            ? twitterChildRef
            : wizard.formStep === 'conflict_of_interests'
            ? conflictOfInterestChildRef
            : wizard.formStep === 'informed_consent'
            ? informedConsentChildRef
            : wizard.formStep === 'funding_support'
            ? fundingSupportChildRef
            : wizard.formStep === 'data_reproducibility'
            ? dataReproducibilityChildRef
            : null;
        !wizard.isVerified && dispatch( handleIsVerified() );
        if ( wizard.isFormValid ) {
            const submitForm = activeStepRef?.current?.submitForm();
            if ( submitForm ) {
                dispatch( nextStep( wizard.isFormValid ) );
            }
        }
    }
    useEffect( () => {
        if ( wizard.workflow?.journal_id !== undefined ) {
            const getAllDocumentTypesFromApi = `${ wizard.baseUrl }/api/v1/journal/type?
            filter[document_type_journals.journal_id]=${ wizard.workflow?.journal_id }`;
            dispatch( getDocumentTypes( getAllDocumentTypesFromApi ) );
        }
        if ( wizard.workflow?.document_id !== undefined && wizard.workflow?.document_id !== '' && wizard.workflow?.document_id !== null ) {
          const getScreeningFromApi = `${ wizard.baseUrl }/api/v1/screening/${ wizard.workflow?.document_id }?include=step`;
          dispatch( getScreening( getScreeningFromApi ) );
        }
    }, [wizard.workflow]);
    useEffect( () => {
        if ( wizard.journal?.attributes?.services?.goftino ) {
            const script = document.createElement('script');
            script.src = 'https://www.goftino.com/widget/M41vwQ';
            script.async = true;
            document.head.appendChild(script);
            return () => {;
                document.head.removeChild(script);
            };
        }
    }, [wizard.journal]);

    return (
        <div className="wizard mb-4">
            <DialogComponent/>
            <FlashMessage className="z-index-1050"/>
            { wizard.formSteps.length > 0 && 
                <p className="mb-0">Step <b>{ wizard.formSteps.findIndex( ( item: any ) => item.attributes?.slug?.includes(wizard.formStep) ) + 1 }</b> of <b>{ wizard.formSteps.length }</b></p>
            }
            <WizardNavigation />
            <div className="d-flex align-items-start">
                <WizardOutline />
                <div className="wizard-steps tab-container p-5 rounded-double bg-white flex-fill position-relative overflow-hidden">
                    <div className="custom-shape-divider-top">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                        </svg>
                    </div>
                    <div className="z-index-2">
                        {
                            ( wizard.workflow?.storage?.types?.doc_type !== undefined && wizard.workflow?.storage?.types?.doc_type !== '' ) &&
                                <p className="fs-7">
                                    <label className="me-2 fw-bold">Document Type:</label>
                                    <span className="text-muted">
                                        { wizard.workflow?.storage?.types?.doc_type
                                            && wizard.documentTypesList.find( 
                                                ( item: any ) => parseInt( item.id ) === parseInt( wizard.workflow.storage.types.doc_type ) 
                                                )?.attributes?.title 
                                        }
                                    </span>
                                </p>
                        }
                        {
                            ( wizard.workflow?.storage?.types?.manuscript_title !== undefined && wizard.workflow?.storage?.types?.manuscript_title !== '' ) &&
                                <p className="fs-7">
                                    <label className="me-2 fw-bold">Manuscript Title:</label>
                                    <span className="text-muted">
                                        { wizard.workflow?.storage?.types?.manuscript_title }
                                    </span>
                                </p>
                        }
                    </div>
                    <hr className="mt-2 mb-4"/>
                    {
                        wizard.formStep === 'revision_message' && <ZeroStep ref={zeroChildRef} />
                    }
                    {
                        wizard.formStep === 'agreement' && <AgreementStep ref={agreementChildRef} />
                    }
                    {
                        wizard.formStep === 'types' && <TypesStep ref={typesChildRef} />
                    }
                    {
                        wizard.formStep === 'section' && <SectionStep ref={sectionChildRef} />
                    }
                    {
                        wizard.formStep === 'authors' && <AuthorsStep ref={authorChildRef} />
                    }
                    {
                        wizard.formStep === 'keywords' && <KeywordsStep ref={keywordsChildRef} />
                    }
                    {
                        wizard.formStep === 'classifications' && <ClassificationsStep ref={classificationsChildRef} />
                    }
                    {
                        wizard.formStep === 'abstract' && <AbstractStep ref={abstractChildRef} />
                    }
                    {
                        wizard.formStep === 'editors' && <EditorStep ref={editorChildRef} />
                    }
                    {
                        wizard.formStep === 'reviewers' && <ReviewersStep ref={reviewersChildRef} />
                    }
                    {
                        wizard.formStep === 'files' && <FilesStep ref={filesChildRef} />
                    }
                    {
                        wizard.formStep === 'comments' && <CommentStep ref={commentChildRef} />
                    }
                    {
                        wizard.formStep === 'region' && <RegionStep ref={regionChildRef} />
                    }
                    {
                        wizard.formStep === 'authors_contribution' && <AuthorContributionStep ref={authorContributionChildRef} />
                    }
                    {
                        wizard.formStep === 'financial_disclosure' && <FinancialDisclosureStep ref={financialDisclosureChildRef} />
                    }
                    {
                        wizard.formStep === 'clinical_trial_registration_code' && <ClinicalTrialRegistrationCodeStep ref={clinicalTrialRegistrationCodeChildRef} />
                    }
                    {
                        wizard.formStep === 'ethical_approval' && <EthicalApprovalStep ref={ethicalApprovalChildRef} />
                    }
                    {
                        wizard.formStep === 'twitter' && <Twitter ref={twitterChildRef} />
                    }
                    {
                        wizard.formStep === 'conflict_of_interests' && <ConflictOfInterestStep ref={conflictOfInterestChildRef} />
                    }
                    {
                        wizard.formStep === 'informed_consent' && <InformedConsentStep ref={informedConsentChildRef} />
                    }
                    {
                        wizard.formStep === 'funding_support' && <FundingSupportStep ref={fundingSupportChildRef} />
                    }
                    {
                        wizard.formStep === 'data_reproducibility' && <DataReproducibilityStep ref={dataReproducibilityChildRef} />
                    }
                    {
                        wizard.formStep === 'build' && <BuildStep/>
                    }
                    { 
                        wizard.formStep !== 'build' &&
                            <div className="d-flex align-items-center justify-content-end mt-4">
                                <button
                                    type="button" 
                                    id="previous-step" 
                                    className={`button btn_secondary me-2 ${ wizard.formStep === wizard.formSteps[0]?.title ? 'd-none' : '' }`} 
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