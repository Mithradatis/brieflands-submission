import ReactHtmlParser from 'react-html-parser'
import { useSelector } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert, FormControl, FormLabel, TextareaAutosize } from '@mui/material'
import { stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'


const BuildStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const stepInstruction = useSelector( stepGuide );

    return (
        <>
            <div id="build" className={`tab${wizard.formStep === 'build' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Build</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
            </div>
        </>
    );
}

export default BuildStep;