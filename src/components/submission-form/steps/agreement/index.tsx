// @flow

import Divider from '@mui/material/Divider'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Checkbox, FormControl, FormControlLabel, Alert, Skeleton } from '@mui/material'
import { formValidator, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { handleCheckbox, handleLoading } from '@/lib/features/submission/steps/agreement/agreementSlice'
import { 
    getAgreementStepData, 
    getAgreementStepGuide, 
    getAgreementTerms,
    updateAgreementStepData 
} from '@/lib/api/steps/agreement'

const AgreementStep = forwardRef(( props, ref ) => {
    const dispatch: any = useDispatch();
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const formState = useSelector( ( state: any ) => state.agreementSlice );
    const [ isValid, setIsValid ] = useState({
        terms: true
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAgreementTermsFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/agreement/current`;
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${ wizard.formStep }`;
    useEffect( () => {
        if ( wizard.formStep === 'agreement' ) {
            dispatch( getAgreementTerms( getAgreementTermsFromApi ) );
            dispatch( getAgreementStepData( getStepDataFromApi ) );
            dispatch( getAgreementStepGuide( getDictionaryFromApi ) );
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
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await dispatch( updateAgreementStepData( getStepDataFromApi ) );
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));
  
    return (
        <>
            <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="agreement" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {   
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' &&
                        <Scrollbars
                            className="mb-4"
                            style={{ width: 100 + '%', height: 200 }}
                            universal={true}
                            autoHide
                            autoHideTimeout={500}
                            autoHideDuration={200}>
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( formState.stepGuide ) }
                            </Alert>
                        </Scrollbars>
                }
                <Scrollbars
                    className="mb-4"
                    style={{ width: 100 + '%', height: 200 }}
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
                                checked={ formState.value?.terms || false }
                                onChange={ event => {
                                        !wizard.isVerified && dispatch( handleIsVerified() ); 
                                        dispatch ( handleCheckbox( { name: event.target.name, value: formState.value?.terms } ) ); 
                                    } 
                                }
                                inputProps={{ 'aria-label': 'terms' }}
                            />
                        }
                        label="I've read and agree to all terms that are mentioned above"
                    />
                    {
                        ( wizard.isVerified && !isValid.terms )
                        && <div className="fs-7 text-danger">Please accept the terms and conditions</div> 
                    }
                </FormControl>
            </div>
        </>
    );
});

AgreementStep.displayName = 'AgreementStep';

export default AgreementStep;