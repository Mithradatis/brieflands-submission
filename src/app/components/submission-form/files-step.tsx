import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { stepState, stepGuide } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const FilesStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const stepInstruction = useSelector( stepGuide );

    return (
        <>
            <div id="files" className={`tab${wizard.formStep === 'files' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Files</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
            </div>
        </>
    );
}

export default FilesStep;