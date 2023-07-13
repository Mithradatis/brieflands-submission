import ReactHtmlParser from 'react-html-parser'
import { useSelector } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert, FormControl, FormLabel, TextareaAutosize } from '@mui/material'
import { stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'


const ConflictOfInterestStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const stepInstruction = useSelector( stepGuide );

    return (
        <>
            <div id="conflict-of-interests" className={`tab${wizard.formStep === 'conflict-of-interests' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Conflict of Interests</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
                <FormControl className="mb-3" fullWidth>
                    <FormLabel className="fw-bold mb-1">
                        Conflict of Interests
                    </FormLabel>
                    <TextareaAutosize
                        name="conflictOfInterests"
                        id="conflictOfInterests"
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

export default ConflictOfInterestStep;