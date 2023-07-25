'use client'

import { useState, useEffect, useRef } from 'react'
import { getSubmissionSteps, getWorkflow } from '@/app/api/client'
import { useDispatch, useSelector } from 'react-redux'
import { wizardState, prevStep, nextStep } from '@/app/features/wizard/wizardSlice'
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

interface ChildComponentProps {
    submitForm: () => void;
}

const SubmissionForm = () => {
    const stepComponents = [
        AgreementStep,
        TypesStep,
        SectionStep,
        AuthorsStep,
        KeywordsStep,
        ClassificationsStep,
        AbstractStep,
        EditorStep,
        ReviewersStep,
        FilesStep,
        CommentStep,
        RegionStep,
        AuthorContributionStep,
        FinancialDisclosureStep,
        ClinicalTrialRegistrationCodeStep,
        EthicalApprovalStep,
        Twitter,
        ConflictOfInterestStep,
        InformedConsentStep,
        FundingSupportStep,
        DataReproducibilityStep,
        BuildStep,
    ];
    const stepRefs: { [key: string]: React.MutableRefObject<ChildComponentProps | null> } = {};
    stepComponents.forEach((StepComponent) => {
        const ref = useRef<ChildComponentProps>(null);
        stepRefs[StepComponent.name] = ref;
    });
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
    const buildChildRef = useRef<ChildComponentProps>( null );
    const dispatch:any = useDispatch();
    const wizard = useSelector( wizardState );
    const [submitReady, setSubmitReady] = useState( false );
    useEffect( () => {
        const getStepsFromApi = 'http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/steps';
        const getWorkflowFromApi = 'http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365';
        dispatch( getSubmissionSteps( getStepsFromApi ) );
        dispatch( getWorkflow( getWorkflowFromApi ) );
    },[]);
    const handleNextStep = () => {
        const activeStepRef = wizard.formStep === 'agreement'
            ? agreementChildRef
            : wizard.formStep === 'types'
            ? typesChildRef
            : wizard.formStep === 'section'
            ? sectionChildRef
            : wizard.formStep === 'author'
            ? authorChildRef
            : wizard.formStep === 'keywords'
            ? keywordsChildRef
            : wizard.formStep === 'classifications'
            ? classificationsChildRef
            : wizard.formStep === 'abstract'
            ? abstractChildRef
            : wizard.formStep === 'editor'
            ? editorChildRef
            : wizard.formStep === 'reviewers'
            ? reviewersChildRef
            : wizard.formStep === 'files'
            ? filesChildRef
            : wizard.formStep === 'comment'
            ? filesChildRef
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
            : wizard.formStep === 'conflice_of_interests'
            ? conflictOfInterestChildRef
            : wizard.formStep === 'informed_consent'
            ? informedConsentChildRef
            : wizard.formStep === 'funding_support'
            ? fundingSupportChildRef
            : wizard.formStep === 'data_reproducibility'
            ? dataReproducibilityChildRef
            : wizard.formStep === 'build'
            ? buildChildRef
            : null;
        if ( wizard.isFormValid ) {
            activeStepRef?.current?.submitForm();
        }    
        dispatch( nextStep( wizard.isFormValid ) );
    }

    return (
        <div className="wizard mb-4">
            <p className="mb-0">Step <b>{ wizard.formSteps.findIndex( ( item: any ) => item.attributes.title?.includes(wizard.formStep) ) + 1 }</b> of <b>{ wizard.formSteps.length }</b></p>
            <WizardNavigation />
            <div className="d-flex align-items-start">
                <WizardOutline />
                <div className="wizard-steps tab-container p-5 rounded-double bg-white flex-fill position-relative overflow-hidden">
                    <div className="custom-shape-divider-top">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                        </svg>
                    </div>
                    <AgreementStep ref={agreementChildRef} />
                    <TypesStep ref={typesChildRef} />
                    <SectionStep ref={sectionChildRef} />
                    <AuthorsStep ref={authorChildRef} />
                    <KeywordsStep ref={keywordsChildRef} />
                    <ClassificationsStep ref={classificationsChildRef} />
                    <AbstractStep ref={abstractChildRef} />
                    <EditorStep ref={editorChildRef} />
                    <ReviewersStep ref={reviewersChildRef} />
                    <FilesStep ref={filesChildRef} />
                    <CommentStep ref={commentChildRef} />
                    <RegionStep ref={regionChildRef} />
                    <AuthorContributionStep ref={authorContributionChildRef} />
                    <FinancialDisclosureStep ref={financialDisclosureChildRef} />
                    <ClinicalTrialRegistrationCodeStep ref={clinicalTrialRegistrationCodeChildRef} />
                    <EthicalApprovalStep ref={ethicalApprovalChildRef} />
                    <Twitter ref={twitterChildRef} />
                    <ConflictOfInterestStep ref={conflictOfInterestChildRef} />
                    <InformedConsentStep ref={informedConsentChildRef} />
                    <FundingSupportStep ref={fundingSupportChildRef} />
                    <DataReproducibilityStep ref={dataReproducibilityChildRef} />
                    <BuildStep ref={buildChildRef} />
                    <div className="d-flex align-items-center justify-content-end mt-4">
                        <button
                            type="button" 
                            id="previous-step" 
                            className={`button btn_secondary me-2 ${ wizard.formStep === wizard.formSteps[0]?.title ? 'd-none' : '' }`} 
                            onClick={ () =>dispatch( prevStep() )}>Back</button>
                        <button
                            type={submitReady ? "submit" : "button"}
                            id="next-step"
                            className={`button btn_primary ${ submitReady ? 'd-none' : '' }`} 
                            onClick={ () => handleNextStep() }>
                            { wizard.formStep === wizard.formSteps[wizard.formSteps.length - 1]?.title ? "submit" : "next" }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmissionForm;