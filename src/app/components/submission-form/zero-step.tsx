import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { stepState } from '@/app/features/submission/zeroSlice'
import { getZeroStepGuide, getZeroStepData } from '@/app/api/zero' 
import ReactHtmlParser from 'react-html-parser'

const ZeroStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/zero`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep}`;
    useEffect( () => {
        dispatch( getZeroStepData( getStepDataFromApi ) );
        dispatch( getZeroStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {}
    }));

    return (
        <>
            <div id="zero" className="tab">
                <h3 className="mb-4 text-shadow-white">Zero</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <Alert severity="info" className="mb-4 break-word">
                    { ReactHtmlParser( formState.value.revise_message ) }
                </Alert>
            </div>
        </>
    );
});

ZeroStep.displayName = 'ZeroStep';

export default ZeroStep;