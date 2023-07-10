import { useSelector } from 'react-redux'
import { stepState } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const FilesStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );

    return (
        <>
            <div id="files" className={`tab${wizard.formStep === 'files' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Files</h3>
            </div>
        </>
    );
}

export default FilesStep;