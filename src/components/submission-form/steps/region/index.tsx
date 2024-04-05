import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import { Autocomplete, FormLabel, FormControl, FormHelperText } from '@mui/joy'
import { formValidator, handleIsVerified } from '@features/wizard/wizardSlice'
import { handleLoading } from '@features/submission/steps/region/regionSlice'
import { useGetRegionsQuery } from '@/app/services/steps/region' 
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const RegionStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string 
        }, 
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const [ formData, setFormData ] = useState({
        id: ''
    });
    const { data: regions, isLoading: regionsIsLoading } = useGetRegionsQuery();
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( regionsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    useEffect( () => {
        if ( stepData ) {
            setFormData( { id: stepData } );
        }
    }, [stepData]);
    useEffect( () => {
        const formIsValid = formData?.id !== null && formData?.id !== '';
        dispatch( formValidator( formIsValid ) );
    }, [formData]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await updateStepDataTrigger( 
                { 
                    url: props.apiUrls.stepDataApiUrl, 
                    data: formData 
                } 
            );
            
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
                <div id="region" className="tab">
                    <h3 className="mb-4 text-shadow-white">Region</h3>
                    {
                        ( 
                            props.details !== undefined && 
                            props.details !== '' 
                        ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {
                        ( 
                            typeof stepGuide === 'string' && 
                            stepGuide.trim() !== '' 
                        ) && (
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
                            </Alert>
                        )
                    }
                    <FormControl 
                        className="mb-3" 
                        error= { 
                            isVerified && 
                            formData?.id === ''
                        }
                    >
                        <FormLabel className="fw-bold mb-1">
                            Region
                        </FormLabel>
                        { regions ? (
                            <Autocomplete
                                color="neutral"
                                size="md"
                                variant="soft"
                                placeholder="Choose one…"
                                disabled={false}
                                name="region"
                                id="region"
                                options={ 
                                    Array.isArray( regions ) 
                                    ? regions.map( 
                                        ( item: any ) => {
                                            return item.attributes?.title || '' 
                                        }
                                    ) : []
                                }
                                value={
                                    ( formData?.id !== '' && regions.length > 0 )
                                    ? regions
                                        .find( 
                                            ( item: any ) => formData?.id === item.id )?.attributes?.title
                                    : null
                                }
                                onChange={(event, value) => {
                                    isVerified && dispatch( handleIsVerified() );
                                    setFormData(
                                        { 
                                            id: regions.find( 
                                                ( item: any ) => item.attributes.title === value )?.id || '' 
                                        } 
                                    ) 
                                }}
                            />
                            ) : (
                            <div>Loading regions...</div>
                        )}
                        {
                            ( 
                                isVerified && 
                                formData?.id === ''
                            ) && 
                                <FormHelperText className="fs-7 text-danger mt-1">
                                    Please select a region
                                </FormHelperText> 
                        }
                    </FormControl>
                </div>
    );
});

RegionStep.displayName = 'RegionStep';

export default RegionStep;