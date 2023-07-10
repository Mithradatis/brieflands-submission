import { useSelector } from 'react-redux'
import { stepState } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const ReviewersStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );

    return (
        <>
            <div id="reviewers" className={`tab${wizard.formStep === 'reviewers' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Reviewers</h3>
            </div>
        </>
    );
}

export default ReviewersStep;