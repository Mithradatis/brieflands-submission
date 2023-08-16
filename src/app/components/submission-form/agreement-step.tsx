import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Checkbox, FormControl, FormControlLabel, Alert } from '@mui/material'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleCheckbox } from '@/app/features/submission/agreementSlice' 
import { getAgreementStepData, getAgreementStepGuide, getAgreementTerms, updateAgreementStepData } from '@/app/api/agreement'
import Divider from '@mui/material/Divider'
import ReactHtmlParser from 'react-html-parser'

const AgreementStep = forwardRef(( props, ref ) => {
    const dispatch: any = useDispatch();
    const wizard = useSelector( wizardState );
    const formState = useSelector( stepState );
    const [ isValid, setIsValid ] = useState({
        terms: true
    });
    const getAgreementTermsFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/agreement/current`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        dispatch( getAgreementTerms( getAgreementTermsFromApi ) );
        dispatch( getAgreementStepData( getStepDataFromApi ) );
        dispatch( getAgreementStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useEffect(() => {
        const formIsValid = formState.value.terms;
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
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateAgreementStepData( getStepDataFromApi ) );

          return true;
        }
    }));

    return (
        <>
            <div id="agreement" className="tab">
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
                    {   formState.agreementTerms.attributes?.translated_content !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.agreementTerms.attributes?.translated_content ) }
                        </Alert>
                    }
                </Scrollbars>
                <Divider />
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
            </div>
        </>
    );
});

AgreementStep.displayName = 'AgreementStep';

export default AgreementStep;