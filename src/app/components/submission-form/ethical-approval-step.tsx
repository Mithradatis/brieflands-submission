import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput } from '@/app/features/submission/ethicalApprovalSlice'
import { getEthicalApprovalStepGuide, getEthicalApprovalStepData } from '@/app/api/ethicalApproval' 
import ReactHtmlParser from 'react-html-parser'

const EthicalApprovalStep = () => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    useEffect( () => {
        if ( wizard.formStep === 'ethical approval' ) {
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getEthicalApprovalStepData( getStepDataFromApi ) );
            dispatch( getEthicalApprovalStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);

    return (
        <>
            <div id="ethical-approval" className={`tab${wizard.formStep === 'ethical approval' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Ethical Approval</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3">
                    <FormLabel className="fw-bold mb-1">
                        Ethical Approval
                    </FormLabel>
                    <Textarea
                        variant="soft"
                        name="ethicalApproval"
                        id="ethicalApproval"
                        className="rounded"
                        aria-label="textarea"
                        placeholder="Enter your text here"
                        minRows={4}
                        maxRows={10}
                        defaultValue={ formState.value?.text ? formState.value.text : '' }
                        onChange={( event: any ) => {
                            dispatch( handleInput( {name: event.target.name, value: event.target.value} ) );
                        }}
                    />
                </FormControl>
            </div>
        </>
    );
}

export default EthicalApprovalStep;