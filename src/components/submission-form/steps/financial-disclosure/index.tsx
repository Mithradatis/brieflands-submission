import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch } from '@/app/store'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { formValidator } from '@features/wizard/wizardSlice'
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const FinancialDisclosureStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string
        },
        ref 
    ) => {
    const [ formData, setFormData ] = useState({
        text: ''
    }); 
    const dispatch = useAppDispatch();
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    useEffect( () => {
        dispatch( formValidator( true ) );
    }, []);
    useEffect( () => {
        if ( stepData ) {
            setFormData( stepData );
        }
    }, [stepData]);
    useImperativeHandle(ref, () => ({
        async submitForm () { 
          let isAllowed = false;   
          try {
            await updateStepDataTrigger( 
                { 
                    url: props.apiUrls.stepDataApiUrl, 
                    data: formData 
                } 
            )
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));

    return (
        isLoading
            ? <StepPlaceholder/>
            :
                <div id="financial-disclosure" className="tab">
                    <h3 className="mb-4 text-shadow-white">Financial Disclosure</h3>
                    {
                        ( props.details !== undefined && props.details !== '' ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
                            </Alert>
                        )
                    }
                    <FormControl className="mb-3">
                        <FormLabel className="fw-bold mb-1">
                            Financial Disclosur
                        </FormLabel>
                        <Textarea
                            variant="soft"
                            name="financialDisclosur"
                            id="financialDisclosur"
                            className="rounded"
                            aria-label="textarea"
                            placeholder="Enter your text here"
                            minRows={4}
                            maxRows={10}
                            value={ formData?.text ? formData?.text : '' }
                            onChange={( event: any ) => {
                                setFormData( { text: event.target.value } );
                            }}
                        />
                    </FormControl>
                </div>
    );
});

FinancialDisclosureStep.displayName = 'FinancialDisclosureStep';

export default FinancialDisclosureStep;