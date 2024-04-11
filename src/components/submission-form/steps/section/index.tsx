import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { formValidator, handleIsVerified } from '@features/wizard/wizardSlice'
import { useGetSectionsQuery } from '@/app/services/steps/section'
import { type sectionsListItem } from '@/app/services/types/section'
import {
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const SectionStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string,
            workflowId: string 
        },
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const [ formData, setFormData ] = useState({
        id: 0,
    });
    const getAllTypesFromApi = 'journal/section';
    const { data: sections, isLoading: sectionsIsLoading } = useGetSectionsQuery( getAllTypesFromApi );
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( sectionsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    useEffect( () => {
        if ( stepData ) {
            setFormData( { id: stepData } );
        }
    }, [stepData]);
    useEffect( () => {
        const formIsValid = formData?.id !== null && formData?.id !== 0;
        dispatch( formValidator( formIsValid ) );
    }, [formData]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
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
            ? <StepPlaceholder />
            :
                <div id="section" className="tab">
                    <h3 className="mb-4 text-shadow-white">Section</h3>
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
                    <FormControl 
                        className="mb-3" 
                        error={ 
                            isVerified && formData?.id === 0
                        }
                    >
                        <FormLabel className="fw-bold mb-1">
                            Please Choose
                        </FormLabel>
                        <Autocomplete
                            required
                            key="section"
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="section"
                            id="section"
                            options={ 
                                Array.isArray( sections ) 
                                ? sections.map( 
                                    item => {
                                        return item.attributes?.title || '' 
                                    }
                                ) : []
                            }
                            value={
                                ( 
                                    formData && formData?.id && 
                                    formData?.id !== 0 && 
                                    sections.length > 0 
                                )
                                ? sections.find(
                                    ( item: sectionsListItem ) => 
                                    formData?.id.toString() === item.id.toString()
                                )?.attributes?.title
                                : null
                            }
                            onChange={(event, value) => {
                                !isVerified && dispatch( handleIsVerified() );
                                setFormData(
                                    {
                                        id: sections.find( 
                                            ( item: sectionsListItem ) => 
                                                item.attributes.title === value )?.id || 0 
                                    } 
                                )
                            }}
                        />
                        {
                            ( 
                                isVerified && formData?.id === 0
                            ) &&
                                <FormHelperText className="fs-7 text-danger mt-1">
                                    You should choose a section.
                                </FormHelperText>
                        }
                    </FormControl>
                </div>
    );
});

SectionStep.displayName = 'SectionStep';

export default SectionStep;