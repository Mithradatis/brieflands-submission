import { useEffect } from 'react';
import './../resources/css/formWizard.scss';

const WizardNavigation = ({formStep, loadStep, steps}) => {
    useEffect(() => {
        const stepsList = document.querySelector('.wizard-navigation > ol');
        const activeStep = stepsList.querySelector('li.active');
        const parentWidth = stepsList.parentNode.clientWidth;
        const activeStepRect = activeStep.getBoundingClientRect();
        const stepsListRect = stepsList.getBoundingClientRect();
        const leftOffset = activeStepRect.left - stepsListRect.left + (activeStepRect.width / 2) - (parentWidth / 2);
        stepsList.style.transform = `translateX(${-leftOffset}px)`;
    }, [formStep]);

    return (
        <>
            <div className="wizard-navigation-container position-relative mb-4 pt-4 overflow-hidden">
                <div className="wizard-navigation position-relative" id="submission-form-wizard">
                    <div className="start-gradient bg-texture"></div>
                    <div className="end-gradient bg-texture"></div>
                    <ol className="d-flex align-items-center text-shado position-relative">
                        {
                            steps.map( (item, index) => (
                                <li className={`pe-5 ${formStep === item.title ? 'active' : ''}`} key={item.title}>
                                    <a href={`#${item.title}`} onClick={() => loadStep(item.title)} className="d-flex flex-column align-items-center">
                                        <span className="fw-bold index d-flex align-items-center justify-content-center mb-2">{ index + 1 }</span>
                                        <span className="fs-bold text-shadow">{ item.title }</span>
                                    </a>
                                </li>
                            ))
                        }
                    </ol>
                </div>
            </div>
        </>
    );
}

export default WizardNavigation;