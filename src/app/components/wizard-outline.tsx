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
                        wizard.formSteps.map( ( item: any ) => (
                            <li className={wizard.formStep === item.title ? 'active' : ''} key={item.title}>
                                <a href={`#${item.title}`} onClick={() => dispatch( loadStep( item.title ) ) }>
                                    {item.title}
                                </a>
                            </li>
                        ))
                    }
                </ol>
            </div>
        </>
    );
}

export default WizardOutline;