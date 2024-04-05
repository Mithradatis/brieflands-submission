// @flow

import StepPlaceholder from "@components/partials/placeholders/step-placeholder"
import Divider from "@mui/material/Divider"
import ReactHtmlParser from "react-html-parser"
import { shouldStepUpdate } from "@/app/services/validators"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Scrollbars } from "react-custom-scrollbars"
import { Checkbox, FormControl, FormControlLabel, Alert } from "@mui/material"
import { useGetAgreementTermsQuery } from "@/app/services/steps/agreement"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from "@/app/services/apiSlice"
import {
  formValidator,
  handleIsVerified,
  prevStep
} from "@features/wizard/wizardSlice"
import {
  Value
} from "@/app/services/types/agreement"

const AgreementStep = forwardRef(
  (
    props: {
      apiUrls: { 
        stepDataApiUrl: string; 
        stepGuideApiUrl: string 
      };
      details: string;
      workflowId: string;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const [isValid, setIsValid] = useState<any>({
      terms: true,
    });
    const { data: agreementTerms, isLoading: agreementTermsIsLoading } = useGetAgreementTermsQuery( props.workflowId );
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    const isLoading: boolean = ( agreementTermsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' )
    const [formData, setFormData] = useState<Value>({ terms: false });
    useEffect( () => {
        if ( stepData ) {
            setFormData( stepData );
        }
    }, [stepData]);
    useEffect(() => {
        if ( stepData ) {
            const formIsValid = formData?.terms || false;
            dispatch( formValidator( formIsValid ) );
        }
    }, [formData]);
    useEffect( () => {
        if ( isVerified ) {
            setIsValid( ( prevState: object ) => ({
                ...prevState,
                terms: formData?.terms || ''
            }));
        }
    }, [formData, isVerified]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          let isAllowed = false;
          try {
            const newData = {
                id: parseInt( agreementTerms?.id ),
                version: agreementTerms?.attributes?.version,
                ...formData,
            };
            if ( shouldStepUpdate( stepData, formData ) ) {
                await updateStepDataTrigger(
                    {
                        url: props.apiUrls.stepDataApiUrl,
                        data: newData
                    }
                );
            }
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }

          return isAllowed;
        }
    }));

    return (
      <>
        { 
            isLoading
                ? <StepPlaceholder />
                : <div 
                    id="agreement" 
                    className="tab"
                >
                    <h3 className="mb-4 text-shadow-white">Agreement</h3>
                    {
                        ( props.details !== undefined && props.details !== '' ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {   
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' &&
                            <Scrollbars
                                className="mb-4"
                                style={{ width: 100 + '%', height: 200 }}
                                universal={true}
                                autoHide
                                autoHideTimeout={500}
                                autoHideDuration={200}>
                                <Alert severity="info" className="mb-4">
                                    { 
                                        ReactHtmlParser( stepGuide ) 
                                    }
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
                        {  agreementTerms?.attributes?.translated_content !== undefined &&
                            <Alert severity="info" className="mb-4">
                                { 
                                    ReactHtmlParser( agreementTerms.attributes.translated_content ) 
                                }
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
                                    checked={ formData?.terms || false }
                                    onChange={ 
                                        () => {
                                            !isVerified && dispatch( handleIsVerified() ); 
                                            setFormData(
                                                ( prevState: any ) => ({ 
                                                    ...prevState, 
                                                    terms: !formData?.terms
                                                }) 
                                            )
                                        } 
                                    }
                                    inputProps={{ 'aria-label': 'terms' }}
                                />
                            }
                            label="I've read and agree to all terms that are mentioned above"
                        />
                        {
                            ( 
                                isVerified && 
                                !isValid.terms 
                            ) && 
                                <div className="fs-7 text-danger">
                                    Please accept the terms and conditions
                                </div> 
                        }
                    </FormControl>
                </div>
        }
      </>
    );
  }
);

AgreementStep.displayName = "AgreementStep";

export default AgreementStep;
