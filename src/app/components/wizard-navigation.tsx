import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '@/app/resources/css/formWizard.scss'
import { loadStep, wizardState } from '@/app/features/wizard/wizardSlice'

const WizardNavigation = () => {
    const wizard = useSelector( wizardState );
    const dispatch = useDispatch();
    useEffect(() => {
        const stepsList = document.querySelector('.wizard-navigation > ol');
        if ( stepsList instanceof HTMLElement ) {
            const activeStep = stepsList.querySelector('li.active');
            if ( stepsList.parentNode instanceof HTMLElement) {
                const parentWidth = stepsList.parentNode.clientWidth;
                if ( activeStep !== null ) {
                    const activeStepRect = activeStep.getBoundingClientRect();
                    const stepsListRect = stepsList.getBoundingClientRect();
                    const leftOffset = activeStepRect.left - stepsListRect.left + (activeStepRect.width / 2) - (parentWidth / 2);
                    stepsList.style.transform = `translateX(${-leftOffset}px)`;
                }
            }
        }
    }, [wizard.formStep]);

    return (
        <>
            <div className="wizard-navigation-container position-relative pt-5 overflow-hidden">
                <div className="wizard-navigation position-relative" id="submission-form-wizard">
                    <div className="start-gradient bg-texture"></div>
                    <div className="end-gradient bg-texture"></div>
                    <ol className="d-flex align-items-center text-shado position-relative">
                        {
                            wizard.formSteps.map( ( item: any, index: number ) => (
                                <li className={`pe-5 ${wizard.formStep === item.title ? 'active' : ''}`} key={item.title}>
                                    <a href={`#${item.title}`} onClick={() => dispatch( loadStep( item.title ) )} className="d-flex flex-column align-items-center text-center">
                                        <span className="fw-bold index d-flex align-items-center justify-content-center">{ index + 1 }</span>
                                        <span className="fs-bold text-shadow">{ item.title.replace(/-/g, ' ') }</span>
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