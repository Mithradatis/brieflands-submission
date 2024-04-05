import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import { Checkbox, FormControl, Card, CardContent } from '@mui/joy'
import { useLazyGetFinalAgreementGuideQuery } from '@/app/services/steps/build'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { handleSnackbarOpen } from '@features/snackbar/snackbarSlice'
import { 
    formValidator,
    loadStep,
    prevStep, 
    handleIsVerified, 
    Wizard 
} from '@features/wizard/wizardSlice'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'

export type Build = {
    terms: boolean;
    word_count?: string;
    standard_word_count?: string;
    word_count_include_in_fee?: string;
    prices?: any;
    final_message?: string;
    journal_agreement_message?: string;
    files?: {
        full?: string;

    };
}

const BuildStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string 
        }, 
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const wizard: Wizard = useAppSelector( ( state: any ) => state.wizard );
    const [getFinalAgreementTrigger] = useLazyGetFinalAgreementGuideQuery();
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, isError, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    if ( isError ) {
        let unfinishedStep = error.data.data.step;
        const footnotes = ['authors_contribution', 'funding_support', 'conflict_of_interests'];
        const ethicalStatements = ['clinical_trial_registration_code', 'ethical_approval', 'informed_consent', 'data_availability'];
        if ( footnotes.includes( unfinishedStep ) ) {
          unfinishedStep = 'footnotes';
        }
        if ( ethicalStatements.includes( unfinishedStep ) ) {
          unfinishedStep = 'ethical_statements';
        }
        dispatch( loadStep( unfinishedStep ) );
        dispatch( handleSnackbarOpen( { severity: 'error', message: error.data.data.message } ) );
      }
    const isLoading: boolean = ( stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ finalAgreementGuide, setFinalAgreementGuide ] = useState('');
    const [ formData, setFormData ] = useState<Build>({
        terms: true
    });
    const finishWorkflowUrl = 
        `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/finish`;
    useEffect( () => {
        if ( stepData ) {
            setFormData( stepData );
        }
    }, [stepData]);
    useEffect(() => {
        const formIsValid = formData?.terms;
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formData]);
    useEffect( () => {
        let getFinalAgreementDictionary = '';
        if( wizard.journal?.attributes?.shopping_status ) {
            getFinalAgreementDictionary = 
                `${ process.env.API_URL }/dictionary/get/journal.submission.final.agreement.apc`;
        } else {
            getFinalAgreementDictionary = 
                `${ process.env.API_URL }/dictionary/get/journal.submission.final.agreement`;
        }
        setFinalAgreementGuide( getFinalAgreementTrigger( getFinalAgreementDictionary ) );
    }, [wizard.journal]);

    return (
        isLoading
            ? <StepPlaceholder/>
            :
                <div id="build" className="tab">
                    <h3 className="mb-4 text-shadow-white">Build</h3>
                    {
                        ( props.details && props.details !== '' ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {   stepGuide &&     
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
                            </Alert>
                    }
                    <div className="d-flex align-items-center">
                        {
                            formData?.files?.full !== '' &&
                            <div className="w-50 w-md-50">
                                <a 
                                    href={ formData?.files?.full } 
                                    target="_blank" 
                                    rel="noopener noreferrer">
                                    <Card 
                                        variant="solid" 
                                        color="primary" 
                                        className="dashboard-stat pb-0 px-0 pt-4 mb-4">
                                        <CardContent>
                                            <div className="overflow-hidden mb-3">
                                                <i className="dashboard-stat-icon fa-duotone fa-file-pdf text-white opacity-50"></i>
                                                <span className="fs-4 ps-5 pt-1 ms-3">
                                                    Full File
                                                </span>
                                            </div>
                                            <div className="dashboard-stat-footer text-light fs-7 px-3 py-1">
                                                <i className="fa-duotone fa-download me-1"></i>
                                                <span>
                                                    Get File
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            </div>
                        }
                    </div>
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( finalAgreementGuide ) }
                        <hr/>
                        { 
                            formData?.standard_word_count && 
                            <div>
                                Standard cord count is: { formData?.standard_word_count }
                            </div> 
                        }
                        {
                            formData?.word_count && 
                            <div>
                                Word count(Total) of manuscript is about: 
                                <span className="fw-bold">
                                    { formData?.word_count }
                                </span>
                            </div> 
                        }
                        { 
                            ( 
                                wizard.journal?.attributes?.shopping_status === 'active' && 
                                formData?.word_count_include_in_fee 
                            ) && 
                                <div>
                                    Word count(include in fee) of manuscript is about: 
                                    <span className="fw-bold">
                                        { formData?.word_count_include_in_fee }
                                    </span>
                                </div> 
                        }
                        {
                            ( 
                                wizard.journal?.attributes?.shopping_status === 'active' && 
                                formData?.prices && 
                                Object.keys( formData?.prices ).length > 0 
                            ) && 
                                <div>
                                    Invoice amount(VAT included) will be: 
                                    {
                                        Object.entries( 
                                            formData?.prices['Acceptance Fee']).map(
                                                ( [ currency, value ] ) => (
                                                    <span key={currency} className="fw-bold">
                                                        { ` ${ value } ${ currency }` }
                                                    </span>
                                                )
                                            )
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
                                label={ <span className="fs-7 text-muted">{ 
                                    formData?.journal_agreement_message 
                                    }</span> 
                                }
                                checked={ formData?.terms || false }
                                onChange={ event => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        setFormData( 
                                            {
                                                terms: formData?.terms 
                                            } 
                                        )
                                    } 
                                }
                            />
                            {
                                ( 
                                    wizard.isVerified && 
                                    !formData?.terms
                                )
                                && 
                                    <div className="fs-7 text-danger">
                                        Please check the agreement to continue
                                    </div> 
                            }
                        </FormControl>
                    </form>
                    <div className="d-flex align-items-center justify-content-end mt-4">
                        <button
                            type="button" 
                            id="previous-step" 
                            className={`button btn_secondary me-2 ${ 
                                wizard.formStep === wizard.formSteps[0]?.attributes.title ? 'd-none' : '' 
                            }`} 
                            onClick={ () =>dispatch( prevStep() )}>
                            Back
                        </button>
                        <button
                            type="button"
                            id="next-step"
                            className={`button btn_primary`}
                            onClick={ () => {
                                if ( formData?.terms ) {
                                    dispatch( handleDialogOpen({ 
                                        actions: { finishWorkflow: finishWorkflowUrl },
                                        data: '',
                                        dialogTitle: 'Finish Submission', 
                                        dialogContent: { content: formData?.final_message }, 
                                        dialogAction: 'finish-submission' } 
                                        ) );
                                } else {
                                    setFormData({ terms: false });
                                }
                            }}>
                            Finish
                        </button>
                    </div>
                </div>
    );
});

BuildStep.displayName = 'BuildStep';

export default BuildStep;