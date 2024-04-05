import { useEffect, useState } from 'react'
import { FormStep } from '@/app/services/types'
import { loadStep } from '@/lib/features/wizard/wizardSlice'
import { useAppDispatch, useAppSelector } from '@/app/store'

const WizardOutline = ( 
    props: {
        hasTypeDetermined: boolean 
    } 
) => {
    const dispatch = useAppDispatch();
    const formSteps: FormStep[] = useAppSelector( ( state: any ) => state.wizard.formSteps );
    const formStep = useAppSelector( ( state: any ) => state.wizard.currentStep );
    useEffect( () => {
        const animationDuration = .5;
        const animationDelay = .05;
        const items = document.querySelectorAll('.animated-items > .item');
        items.forEach( ( item: any, index: number ) => {
            item.style.animation = `fadeInRight ${animationDuration}s ease ${index * animationDelay}s both`;
        });
    }, [formSteps]);

    return (
        <div className="wizard-outline position-relative pe-4 py-4 text-shadow d-none d-md-block">
            <ol className="fs-7 animated-items">
                {
                    formSteps?.map( ( item: any ) => {
                        const formStepTitle = item.attributes?.slug;

                        return (
                            <li 
                                className={ `${ 
                                    formStep === formStepTitle 
                                        ? 'active ' 
                                        : ''}item` 
                                } 
                                key={ formStepTitle }
                            >
                                <a href={`#${formStepTitle}`}
                                    className={ ( 
                                        !props.hasTypeDetermined && 
                                        ( 
                                            formStepTitle !== 'agreement' && 
                                            formStepTitle !== 'types' 
                                        ) 
                                    ) ? 'disabled' : '' }
                                    onClick={() => dispatch( loadStep( formStepTitle ) ) }>
                                    <span className="text-capitalize">
                                        { formStepTitle?.replace(/_/g, ' ') }
                                    </span>
                                    {
                                        item.attributes?.required &&
                                            <span className="ms-1">*</span>
                                    }
                                </a>
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    );
};

export default WizardOutline;