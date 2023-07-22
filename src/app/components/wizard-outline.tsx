import { useDispatch, useSelector } from 'react-redux'
import { wizardState, loadStep } from '@/app/features/wizard/wizardSlice'

const WizardOutline = () => {
    const wizard = useSelector( wizardState );
    const dispatch = useDispatch();

    return (
        <>
            <div className="wizard-outline position-relative pe-4 py-4 text-shadow">
                <ol className="fs-7">
                    {
                        wizard.formSteps.map( ( item: any ) => {
                            const formStepTitle = item.attributes.title.toLowerCase();
                            return (
                                <li className={wizard.formStep === formStepTitle ? 'active' : ''} key={ formStepTitle }>
                                    <a href={`#${formStepTitle}`} onClick={() => dispatch( loadStep( formStepTitle ) ) }>
                                        { formStepTitle.replace(/-/g, ' ') }
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