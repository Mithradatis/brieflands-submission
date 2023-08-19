import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator, prevStep, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { Checkbox, FormControl, Card, CardContent } from '@mui/joy'
import { stepState, handleCheckbox } from '@/app/features/submission/buildSlice'
import { handleDialogOpen } from '@/app/features/dialog/dialogSlice'
import { getBuildStepGuide, getBuildStepData, getFinalAgreementGuide } from '@/app/api/build'
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
    }, [wizard.formStep, formState.value]);
    useEffect( () => {
        if ( wizard.isVerified ) {
            setIsValid(prevState => ({
                ...prevState,
                terms: formState.value.terms
            }));
        }
    }, [formState.value, wizard.isVerified]);

    useEffect( () => {
        let getFinalAgreementDictionary = '';
        if( wizard.journal?.attributes?.shopping_status ) {
            getFinalAgreementDictionary = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.final.agreement.apc`;
        } else {
            getFinalAgreementDictionary = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.final.agreement`;
        }
        dispatch( getFinalAgreementGuide( getFinalAgreementDictionary ) );
    }, [wizard.journal]);

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
                <Alert severity="info" className="mb-4">
                    { ReactHtmlParser( formState.finalAgreementGuide ) }
                    <hr/>
                    { 
                        formState.value.standard_word_count && 
                        <div>
                            Standard cord count is: { formState.value.standard_word_count }
                        </div> 
                    }
                    {
                        formState.value.word_count && 
                        <div>
                            Word count(Total) of manuscript is about: <span className="fw-bold">{ formState.value.word_count }</span>
                        </div> 
                    }
                    { 
                        ( wizard.journal?.attributes?.shopping_status === 'active' && formState.value.word_count_include_in_fee ) && 
                        <div>
                            Word count(include in fee) of manuscript is about: <span className="fw-bold">{ formState.value.word_count_include_in_fee }</span>
                        </div> 
                    }
                    { 
                        (wizard.journal?.attributes?.shopping_status === 'active' && formState.value.prices) && 
                        <div>
                            Invoice amount(VAT included) will be: 
                            {
                                Object.entries( formState.value.prices['Acceptance Fee']).map(([currency, value]) => (
                                    <span key={currency} className="fw-bold">
                                        { ` ${ value } ${ currency }` }
                                    </span>
                                ))
                            }
                        </div> 
                    }
                </Alert>
                <form name="build-form" id="build-form">
                    <FormControl className="mb-4">
                        <Checkbox
                            required
                            name="terms"
                            id="terms"
                            label={ <span className="fs-7 text-muted">{ formState.value.journal_agreement_message }</span> }
                            checked={ formState.value.terms || false }
                            onChange={ event => {
                                    !wizard.isVerified && dispatch( handleIsVerified() );
                                    dispatch ( handleCheckbox( { name: event.target.name, value: formState.value?.terms } ) ) 
                                } 
                            }
                        />
                        {
                            ( wizard.isVerified && !formState.value?.terms && !isValid.terms )
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
                                    dialogContent: { content: formState.value.final_message }, 
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