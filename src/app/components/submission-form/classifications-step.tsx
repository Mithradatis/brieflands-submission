import { useSelector } from 'react-redux'
import { stepState } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const ClassificationsStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );

    return (
        <>
            <div id="classifications" className={`tab${wizard.formStep === 'classifications' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Classifications</h3>
            </div>
        </>
    );
}

export default ClassificationsStep;