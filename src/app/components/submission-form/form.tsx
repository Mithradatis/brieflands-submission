'use client'

import { useState, useEffect } from 'react'
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
import DataReprodacibilityStep from '@/app/components/submission-form/data-reprodacibility-step'
import BuildStep from '@/app/components/submission-form/build-step'
import { useDispatch, useSelector } from 'react-redux'
import { formValidation, formValidator } from '@/app/features/submission/submissionSlice'
import { wizardState, prevStep, nextStep } from '@/app/features/wizard/wizardSlice'
import { fetchInitialState, getStepGuide, getKeywordsList } from '@/app/api/client'

const SubmissionForm = () => {
    const wizard = useSelector( wizardState );
    const [submitReady, setSubmitReady] = useState(false);
    const formIsValid = useSelector( formValidation );
    const dispatch:any = useDispatch();
    useEffect( () => {
        dispatch( fetchInitialState(`./../api/${ wizard.formStep }.json`) );
        dispatch( getStepGuide( `./../api/${ wizard.formStep }-guide.json` ) );
        dispatch( getKeywordsList( `./../api/${ wizard.formStep }-list.json` ) );
    }, [wizard.formStep]);

    return (
        <div className="wizard mb-4">
            <p className="mb-0">Step <b>{ wizard.formSteps.findIndex( ( item: any ) => item.title.includes(wizard.formStep) ) + 1 }</b> of <b>{ wizard.formSteps.length }</b></p>
            <WizardNavigation />
            <div className="d-flex align-items-start">
                <WizardOutline />
                <div className="wizard-steps tab-container p-5 rounded-double bg-white flex-fill position-relative overflow-hidden">
                    <div className="custom-shape-divider-top">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                        </svg>
                    </div>
                    <AgreementStep />
                    <TypesStep />
                    <SectionStep />
                    <AuthorsStep />
                    <KeywordsStep />
                    <ClassificationsStep />
                    <AbstractStep />
                    <EditorStep />
                    <ReviewersStep />
                    <FilesStep />
                    <CommentStep />
                    <RegionStep />
                    <AuthorContributionStep />
                    <FinancialDisclosureStep />
                    <ClinicalTrialRegistrationCodeStep />
                    <EthicalApprovalStep />
                    <Twitter />
                    <ConflictOfInterestStep />
                    <InformedConsentStep />
                    <FundingSupportStep />
                    <DataReprodacibilityStep />
                    <BuildStep />
                    <div className="d-flex align-items-center justify-content-end mt-4">
                        <button
                            type="button" 
                            id="previous-step" 
                            className={`button btn_secondary me-2 ${ wizard.formStep === wizard.formSteps[0].title ? 'd-none' : '' }`} 
                            onClick={ () =>dispatch( prevStep() )}>Back</button>
                        <button
                            type={submitReady ? "submit" : "button"}
                            id="next-step"
                            className={`button btn_primary ${ submitReady ? 'd-none' : '' }`} 
                            onClick={ () => dispatch( nextStep( formIsValid ) )}>
                            { wizard.formStep === wizard.formSteps[wizard.formSteps.length - 1].title ? "submit" : "next" }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmissionForm;