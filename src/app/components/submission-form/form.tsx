'use client'

import { SetStateAction, useState } from 'react';
import { useSwitchTransition } from 'transition-hook';
import WizardNavigation from '../wizard-navigation';
import WizardOutline from '../wizard-outline';
import AgreementStep from './agreement-step';
import TypesStep from './types-step';
import SectionStep from './section-step';
import AuthorsStep from './authors-step';
import KeywordsStep from './keywords-step';
import ClassificationsStep from './classifications-step';
import AbstractStep from './abstract-step';
import EditorStep from './editor-step';
import ReviewersStep from './reviewers-step';
import FilesStep from './files-step';

const SubmissionForm = ({ handleOpen, setBodyBlurred, modalCalledForm, setModalCalledForm }) => {
    const steps = [
        {id: 1, title: 'agreement', status: 'incomplete', active: false},
        {id: 2, title: 'types', status: 'incomplete', active: false},
        {id: 3, title: 'section', status: 'incomplete', active: false},
        {id: 4, title: 'authors', status: 'incomplete', active: true},
        {id: 5, title: 'keywords', status: 'incomplete', active: false},
        {id: 6, title: 'classifications', status: 'incomplete', active: false},
        {id: 7, title: 'abstract', status: 'incomplete', active: false},
        {id: 8, title: 'editor', status: 'incomplete', active: false},
        {id: 9, title: 'reviewers', status: 'incomplete', active: false},
        {id: 10, title: 'files', status: 'incomplete', active: false},
    ];
    const [ formStep, setFormStep ] = useState( `${steps.filter( item => item.active )[0].title}` );
    const [formData, setFormData] = useState({});
    const [submitReady, setSubmitReady] = useState(false);
    const loadStep = ( step: SetStateAction<string> ) => {
        setFormStep( step );
    };
    const prevStep = () => {
        const currentStepIndex = steps.findIndex( item => item.title.includes(formStep));
        setSubmitReady(false);
        if ( currentStepIndex - 1 >= 0 ) {
            setFormStep( steps[currentStepIndex - 1].title );
        }
    }
    const nextStep = () => {
        const currentStepIndex = steps.findIndex( item => item.title.includes(formStep));
        const isLastStep = currentStepIndex === steps.length - 1;
        if ( currentStepIndex < steps.length ) {
            setFormStep( steps[currentStepIndex + 1].title );
            setSubmitReady( isLastStep );
        }
    }
    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        alert('Submit Successfuly!');
    }
    const handleModal = () => {
        setModalCalledForm(formStep);
        handleOpen();
        setBodyBlurred( true );
    }

    return (
        <div className="wizard mb-4">
            <p className="mb-0">Step <b>{ steps.findIndex( item => item.title.includes(formStep) ) + 1 }</b> of <b>{ steps.length }</b></p>
            <WizardNavigation formStep={formStep} setFormStep={setFormStep} loadStep={loadStep} steps={steps} />
            <div className="d-flex align-items-start">
                <WizardOutline formStep={formStep} setFormStep={setFormStep} loadStep={loadStep} steps={steps} />
                
                <div className="wizard-steps tab-container p-5 rounded-double bg-white flex-fill position-relative overflow-hidden">
                    <div className="custom-shape-divider-top">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                        </svg>
                    </div>
                    <form name="submission-form" id="submission-form" onSubmit={handleSubmit}>
                        <AgreementStep formStep={formStep} setFormStep={setFormStep} />
                        <TypesStep formStep={formStep} setFormStep={setFormStep} />
                        <SectionStep formStep={formStep} setFormStep={setFormStep} />
                        <AuthorsStep 
                            formStep={formStep}
                            setFormStep={setFormStep}
                            handleModal={handleModal}
                            modalCalledForm={modalCalledForm}
                            setModalCalledForm={setModalCalledForm}
                        />
                        <KeywordsStep formStep={formStep} setFormStep={setFormStep} />
                        <ClassificationsStep formStep={formStep} setFormStep={setFormStep} />
                        <AbstractStep formStep={formStep} setFormStep={setFormStep} />
                        <EditorStep formStep={formStep} setFormStep={setFormStep} />
                        <ReviewersStep formStep={formStep} setFormStep={setFormStep} />
                        <FilesStep formStep={formStep} setFormStep={setFormStep} />
                        <div className="d-flex align-items-center justify-content-end mt-4">
                            <button
                                type="button" 
                                id="previous-step" 
                                className={`button btn_secondary me-2 ${ formStep === steps[0].title ? 'd-none' : '' }`} 
                                onClick={prevStep}>Back</button>
                            <button
                                type={submitReady ? "submit" : "button"}
                                id="next-step"
                                className={`button btn_primary ${ submitReady ? 'd-none' : '' }`} 
                                onClick={nextStep}>
                                {formStep === steps[steps.length - 1].title ? "submit" : "next"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubmissionForm;