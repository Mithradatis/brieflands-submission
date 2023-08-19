import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '@/app/resources/css/formWizard.scss'
import { loadStep, wizardState } from '@/app/features/wizard/wizardSlice'

const WizardNavigation = () => {
    const dispatch = useDispatch();
    const [ formSteps, setFormSteps ] = useState([]);
    const [ isActiveStepSet, setIsActiveStepSet ] = useState( false );
    const wizard = useSelector( wizardState );
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
    }, [isActiveStepSet]);
    useEffect( () => {
        setFormSteps( wizard.formSteps );
    }, [wizard.formSteps]);

    return (
        <>
            <div className="wizard-navigation-container position-relative pt-5 overflow-hidden">
                <div className="wizard-navigation position-relative" id="submission-form-wizard">
                    <div className="start-gradient bg-texture"></div>
                    <div className="end-gradient bg-texture"></div>
                    <ol className="d-flex align-items-center text-shado position-relative">
                        {
                            formSteps.map( ( item: any, index: number ) => {
                                const formStepTitle = item.attributes?.slug;
                                if ( wizard.formStep === formStepTitle ) {
                                    // setIsActiveStepSet( true );
                                }
                                return (
                                    <li 
                                        className={`pe-5 ${wizard.formStep === formStepTitle ? 'active' : ''}`} key={ formStepTitle }>
                                        <a href={`#${formStepTitle}`}
                                        //    className={`d-flex flex-column align-items-center text-center ${ ( wizard.workflow?.storage?.types?.doc_type === undefined && ( formStepTitle !== 'agreement' && formStepTitle !== 'types' ) ) ? 'disabled' : '' }`} 
                                           onClick={() => dispatch( loadStep( formStepTitle ) )}>
                                            <span className="fw-bold index d-flex align-items-center justify-content-center">{ index + 1 }</span>
                                            <span className="fs-bold index-title text-shadow text-capitalize">{ formStepTitle?.replace(/_/g, ' ') }</span>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ol>
                </div>
            </div>
        </>
    );
}

export default WizardNavigation;