import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator, prevStep, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { Checkbox, FormControl, Card, CardContent } from '@mui/joy'
import { handleCheckbox } from '@/lib/features/submission/steps/build/buildSlice'
import { handleDialogOpen } from '@/lib/features/dialog/dialogSlice'
import { getBuildStepGuide, getBuildStepData, getFinalAgreementGuide } from '@/lib/api/steps/build'

const BuildStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.buildSlice );
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const [ isValid, setIsValid ] = useState({
        terms: true
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    const finishWorkflowUrl = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/finish`;
    useEffect( () => {
        if ( wizard.formStep === 'build' ) {
            dispatch( getBuildStepData( getStepDataFromApi ) );
            dispatch( getBuildStepGuide( getDictionaryFromApi ) );
        }
    }, []);
    useEffect(() => {
        const formIsValid = formState.value?.terms;
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect( () => {
        if ( wizard.isVerified ) {
            setIsValid(prevState => ({
                ...prevState,
                terms: formState.value?.terms || ''
            }));
        }
    }, [formState.value, wizard.isVerified]);

    useEffect( () => {
        let getFinalAgreementDictionary = '';
        if( wizard.journal?.attributes?.shopping_status ) {
            getFinalAgreementDictionary = `${ process.env.DICTIONARY_API_URL }/journal.submission.final.agreement.apc`;
        } else {
            getFinalAgreementDictionary = `${ process.env.DICTIONARY_API_URL }/journal.submission.final.agreement`;
        }
        dispatch( getFinalAgreementGuide( getFinalAgreementDictionary ) );
    }, [wizard.journal]);

    return (
        <>
            <div className={ `step-loader ${ formState.isLoading ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="build" className={ `tab ${ formState.isLoading ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Build</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <div className="d-flex align-items-center">
                    {
                        formState.value?.files?.full !== '' &&
                        <div className="w-50 w-md-50">
                            <a href={ formState.value?.files?.full } target="_blank" rel="noopener noreferrer">
                                <Card variant="solid" color="primary" className="dashboard-stat pb-0 px-0 pt-4 mb-4">
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
                        formState.value?.standard_word_count && 
                        <div>
                            Standard cord count is: { formState.value?.standard_word_count }
                        </div> 
                    }
                    {
                        formState.value?.word_count && 
                        <div>
                            Word count(Total) of manuscript is about: <span className="fw-bold">{ formState.value?.word_count }</span>
                        </div> 
                    }
                    { 
                        ( wizard.journal?.attributes?.shopping_status === 'active' && formState.value?.word_count_include_in_fee ) && 
                        <div>
                            Word count(include in fee) of manuscript is about: <span className="fw-bold">{ formState.value?.word_count_include_in_fee }</span>
                        </div> 
                    }
                    {
                        ( wizard.journal?.attributes?.shopping_status === 'active' && formState.value?.prices && Object.keys( formState.value?.prices ).length > 0 ) && 
                            <div>
                                Invoice amount(VAT included) will be: 
                                {
                                    Object.entries( formState.value?.prices['Acceptance Fee']).map(([currency, value]) => (
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
                            label={ <span className="fs-7 text-muted">{ formState.value?.journal_agreement_message }</span> }
                            checked={ formState.value?.terms || false }
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
                            if ( formState.value?.terms ) {
                                dispatch( handleDialogOpen({ 
                                    actions: { finishWorkflow: finishWorkflowUrl },
                                    data: '',
                                    dialogTitle: 'Finish Submission', 
                                    dialogContent: { content: formState.value?.final_message }, 
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