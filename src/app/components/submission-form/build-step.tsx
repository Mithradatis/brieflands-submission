import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { stepState } from '@/app/features/submission/buildSlice'
import { getBuildStepGuide, getBuildStepData } from '@/app/api/build' 
import ReactHtmlParser from 'react-html-parser'

const BuildStep = () => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    useEffect( () => {
        if ( wizard.formStep === 'build' ) {
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getBuildStepData( getStepDataFromApi ) );
            dispatch( getBuildStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);

    return (
        <>
            <div id="build" className={`tab${wizard.formStep === 'build' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Build</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
            </div>
        </>
    );
}

export default BuildStep;