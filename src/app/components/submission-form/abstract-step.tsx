import ReactHtmlParser from 'react-html-parser'
import { useSelector } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert, FormControl, FormLabel, TextareaAutosize } from '@mui/material'
import { stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'


const AbstractStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const abstractStepGuide = useSelector( stepGuide );

    return (
        <>
            <div id="abstract" className={`tab${wizard.formStep === 'abstract' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Abstract</h3>
                <Alert severity="info" className="mb-4">
                    { ReactHtmlParser( abstractStepGuide.guide ) }
                </Alert>
                <FormControl className="mb-3" fullWidth>
                    <FormLabel className="fw-bold mb-1">
                        Manuscript Abstract
                    </FormLabel>
                    <TextareaAutosize
                        className="p-4 rounded"
                        aria-label="textarea"
                        placeholder="Enter your text here"
                        defaultValue=""
                    />
                </FormControl>
            </div>
        </>
    );
}

export default AbstractStep;