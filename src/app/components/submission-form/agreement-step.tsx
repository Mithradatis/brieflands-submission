import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Checkbox, FormControl, FormControlLabel, Alert } from '@mui/material'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleCheckbox } from '@/app/features/submission/agreementSlice' 
import { getAgreementStepData, getAgreementStepGuide, getAgreementTerms } from '@/app/api/agreement'
import Divider from '@mui/material/Divider'
import ReactHtmlParser from 'react-html-parser'

const AgreementStep = () => {
    const dispatch: any = useDispatch();
    const wizard = useSelector( wizardState );
    const formState = useSelector( stepState );
    const [ isValid, setIsValid ] = useState({
        terms: true
    });
    useEffect( () => {
        if ( wizard.formStep === 'agreement' ) {
            const getAgreementTermsFromApi = 'http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/agreement/current';
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${wizard.formStep}`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getAgreementTerms( getAgreementTermsFromApi ) );
            dispatch( getAgreementStepData( getStepDataFromApi ) );
            dispatch( getAgreementStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'agreement' ) {
            const formIsValid = formState.value.terms;
            dispatch( formValidator( formIsValid ) );
        }
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect( () => {
        if ( wizard.formStep === 'agreement' ) {
            if ( wizard.isVerified ) {
                setIsValid(prevState => ({
                    ...prevState,
                    terms: formState.value.terms
                }));
            }
        }
    }, [wizard.isVerified]);

    return (
        <>
            <div id="agreement" className={`tab${wizard.formStep === 'agreement' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                {   
                    formState.stepGuide !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                }
                <Scrollbars
                    className="mb-4"
                    style={{ width: 627, height: 200 }}
                    universal={true}
                    autoHide
                    autoHideTimeout={627}
                    autoHideDuration={200}>
                    {   formState.agreementTerms !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.agreementTerms ) }
                        </Alert>
                    }
                </Scrollbars>
                <Divider />
                <form name="agreement-form" id="agreement-form">
                    <FormControl className="mb-4" fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    required
                                    name="terms"
                                    id="terms"
                                    checked={ formState.value.terms || false }
                                    onChange={ event => dispatch ( handleCheckbox( { name: event.target.name, value: formState.value.terms } ) ) }
                                    inputProps={{ 'aria-label': 'terms' }}
                                />
                            }
                            label="I've read and agree to all terms that are mentioned above"
                        />
                        {
                            ( !formState.value.terms && !isValid.terms ) 
                            && <div className="fs-7 text-danger">Please accept the terms and conditions</div> 
                        }
                    </FormControl>
                </form>
            </div>
        </>
    );
}

export default AgreementStep;