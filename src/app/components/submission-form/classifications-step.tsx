import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect } from 'react'
import { Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Autocomplete, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { handleSelection, stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const ClassificationsStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const stepInstruction = useSelector( stepGuide );
    const [ isValid, setIsValid ] = useState({
        documentClassifications: '',
    });

    return (
        <>
            <div id="classifications" className={`tab${wizard.formStep === 'classifications' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Classifications</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
            </div>
        </>
    );
}

export default ClassificationsStep;