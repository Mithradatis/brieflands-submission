import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator, prevStep } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { Checkbox, FormControl, Card, CardContent } from '@mui/joy'
import { stepState, handleCheckbox } from '@/app/features/submission/buildSlice'
import { handleDialogOpen } from '@/app/features/dialog/dialogSlice'
import { getBuildStepGuide, getBuildStepData } from '@/app/api/build'
import ReactHtmlParser from 'react-html-parser'

const BuildStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        terms: true
    });
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    const finishWorkflowUrl = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/finish`;
    useEffect( () => {
        dispatch( getBuildStepData( getStepDataFromApi ) );
        dispatch( getBuildStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useEffect(() => {
        const formIsValid = formState.value?.terms;
        dispatch( formValidator( formIsValid ) );
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect( () => {
        if ( wizard.isVerified ) {
            setIsValid(prevState => ({
                ...prevState,
                terms: formState.value.terms
            }));
        }
    }, [wizard.isVerified]);

    return (
        <>
            <div id="build" className="tab">
                <h3 className="mb-4 text-shadow-white">Build</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <div className="d-flex align-items-center">
                    {
                        formState.value.files?.blind !== '' && 
                        <div className="flex-fill w-50 pe-4">
                            <a href={ formState.value.files?.blind }>
                                <Card variant="solid" color="primary" className="dashboard-stat pb-0 px-0 pt-4 mb-4">
                                    <CardContent>
                                        <div className="overflow-hidden mb-3">
                                            <i className="dashboard-stat-icon fa-duotone fa-file-pdf text-white opacity-50"></i>
                                            <span className="fs-4 ps-5 pt-1 ms-3">Blind File</span>
                                        </div>
                                        <div className="dashboard-stat-footer text-light fs-7 px-3 py-1">
                                            <i className="fa-duotone fa-download me-1"></i>
                                            <span>Get File</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        </div>
                    }
                    {
                        formState.value.files?.full !== '' &&
                        <div className="flex-fill">
                            <a href={ formState.value.files?.full }>
                                <Card variant="solid" color="primary" className="dashboard-stat pb-0 px-0 pt-4 mb-4" sx={{ width: 320 }}>
                                    <CardContent>
                                        <div className="overflow-hidden mb-3">
                                            <i className="dashboard-stat-icon fa-duotone fa-file-pdf text-white opacity-50"></i>
                                            <span className="fs-4 ps-5 pt-1 ms-3">Full File</span>
                                        </div>
                                        <div className="dashboard-stat-footer text-light fs-7 px-3 py-1">
                                            <i className="fa-duotone fa-download me-1"></i>
                                            <span>Get File</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        </div>
                    }
                </div>
                <form name="build-form" id="build-form">
                    <FormControl className="mb-4">
                        <Checkbox
                            required
                            name="terms"
                            id="terms"
                            label={ <span className="fs-7 text-muted">{ formState.value.journal_agreement_message }</span> }
                            checked={ formState.value.terms || false }
                            onChange={ event => dispatch ( handleCheckbox( { name: event.target.name, value: formState.value?.terms } ) ) }
                        />
                        {
                            ( !formState.value?.terms && !isValid.terms )
                            && <div className="fs-7 text-danger">Please check the agreement to continue</div> 
                        }
                    </FormControl>
                </form>
                <div className="d-flex align-items-center justify-content-end mt-4">
                    <button
                        type="button" 
                        id="previous-step" 
                        className={`button btn_secondary me-2 ${ wizard.formStep === wizard.formSteps[0]?.title ? 'd-none' : '' }`} 
                        onClick={ () =>dispatch( prevStep() )}>
                        Back
                    </button>
                    <button
                        type="button"
                        id="next-step"
                        className={`button btn_primary`}
                        onClick={ () => {
                            if ( formState.value.terms ) {
                                dispatch( handleDialogOpen({ 
                                    action: finishWorkflowUrl,
                                    data: '',
                                    dialogTitle: 'Finish Submission', 
                                    dialogContent: formState.value.final_message, 
                                    dialogAction: 'finish-submission' } 
                                    ) );
                            } else {
                                setIsValid({ terms: false });
                            }
                        }}>
                        Finish
                    </button>
                </div>
            </div>
        </>
    );
});

BuildStep.displayName = 'BuildStep';

export default BuildStep;