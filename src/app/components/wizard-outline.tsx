import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { wizardState, loadStep } from '@/app/features/wizard/wizardSlice'

const WizardOutline = () => {
    const dispatch = useDispatch();
    const [ formSteps, setFormSteps ] = useState([]);
    const [ isDocumentTypeSet, setIsDocumentTypeSet ] = useState( false );
    const wizard = useSelector( wizardState );
    useEffect( () => {
        if ( wizard.workflow?.storage?.types?.doc_type !== undefined ) {
            setIsDocumentTypeSet( true );
        }
        setFormSteps( wizard.formSteps );
        
    }, [wizard.formSteps]);
    useEffect( () => {
        const animationDuration = .5;
        const animationDelay = .05;
        const items = document.querySelectorAll('.animated-items > .item');
        items.forEach( ( item: any, index: number ) => {
            item.style.animation = `fadeInRight ${animationDuration}s ease ${index * animationDelay}s both`;
        });
    }, [formSteps]);

    return (
        <>
            <div className="wizard-outline position-relative pe-4 py-4 text-shadow d-none d-md-block">
                <ol className="fs-7 animated-items">
                    {
                        formSteps.map( ( item: any ) => {
                            const formStepTitle = item.attributes?.slug;
                            return (
                                <li className={ `${ wizard.formStep === formStepTitle ? 'active ' : ''}item` } key={ formStepTitle }>
                                    <a href={`#${formStepTitle}`}
                                       className={ ( !isDocumentTypeSet && ( formStepTitle !== 'agreement' && formStepTitle !== 'types' ) ) ? 'disabled' : '' }
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
        </>
    );
}

export default WizardOutline;