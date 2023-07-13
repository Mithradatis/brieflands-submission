import ReactHtmlParser from 'react-html-parser'
import { useSelector } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert, FormControl, FormLabel, TextareaAutosize } from '@mui/material'
import { stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'


const FinancialDisclosureStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const stepInstruction = useSelector( stepGuide );

    return (
        <>
            <div id="financial-disclosure" className={`tab${wizard.formStep === 'financial-disclosure' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Financial Disclosure</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
                <FormControl className="mb-3" fullWidth>
                    <FormLabel className="fw-bold mb-1">
                        Financial Disclosure
                    </FormLabel>
                    <TextareaAutosize
                        name="financialDisclosure"
                        id="financialDisclosure"
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

export default FinancialDisclosureStep;