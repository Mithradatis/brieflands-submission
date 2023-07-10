import { useSelector } from 'react-redux'
import { stepState } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const EditorStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );

    return (
        <>
            <div id="editor" className={`tab${wizard.formStep === 'editor' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Editor</h3>
            </div>
        </>
    );
}

export default EditorStep;