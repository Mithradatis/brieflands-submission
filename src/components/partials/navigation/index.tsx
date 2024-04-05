import { useEffect, useState } from 'react'
import { FormStep } from '@/app/services/types'
import { loadStep } from '@/lib/features/wizard/wizardSlice'
import { useAppDispatch, useAppSelector } from '@/app/store'

const WizardNavigation = ( 
    props: {
        hasTypeDetermined: boolean 
    } 
) => {
    const dispatch = useAppDispatch();
    const formSteps: FormStep[] = useAppSelector( ( state: any ) => state.wizard.formSteps );
    const formStep = useAppSelector( ( state: any ) => state.wizard.currentStep );
    useEffect( () => {
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
    }, [formStep]);

    return (
        <div className="wizard-navigation-container position-relative pt-5 overflow-hidden mb-2 float-md-end">
            <div className="wizard-navigation position-relative" id="submission-form-wizard">
                <div className="start-gradient bg-texture"></div>
                <div className="end-gradient bg-texture"></div>
                <ol className="d-flex align-items-center text-shado position-relative">
                    {
                        formSteps?.map( ( item: any, index: number ) => {
                            const formStepTitle = item.attributes?.slug;

                            return (
                                <li 
                                    className={`pe-5 ${formStep === formStepTitle ? 'active' : ''}`} key={ formStepTitle }>
                                    <a href={`#${formStepTitle}`}
                                        className={`d-flex flex-column align-items-center text-center ${ 
                                            ( !props.hasTypeDetermined && ( formStepTitle !== 'agreement' && formStepTitle !== 'types' ) ) 
                                                ? ' disabled' 
                                                : '' 
                                            }`
                                        } 
                                        onClick={() => dispatch( loadStep( formStepTitle ) ) }>
                                        <span className="fw-bold index d-flex align-items-center justify-content-center">
                                            <span className="number">{ index + 1 }</span>
                                            <span className="waves">
                                                <span className="wave"></span>
                                                <span className="wave -two"></span>
                                                <span className="wave -three"></span>
                                            </span>
                                        </span>
                                        <span className="fs-bold index-title text-shadow text-capitalize">
                                            { formStepTitle?.replace(/_/g, ' ') }
                                        </span>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ol>
            </div>
        </div>
    );
};

export default WizardNavigation;