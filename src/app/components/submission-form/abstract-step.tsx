import { useSelector } from 'react-redux'
import { stepState } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const AbstractStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );

    return (
        <>
            <div id="abstract" className={`tab${wizard.formStep === 'abstract' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Abstract</h3>
            </div>
        </>
    );
}

export default AbstractStep;