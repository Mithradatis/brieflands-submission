import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, createFilterOptions } from '@mui/joy'
import { formValidator } from '@features/wizard/wizardSlice'
import {  handleLoading } from '@features/submission/steps/classifications/classificationsSlice'
import { useGetStepDataQuery, useGetStepGuideQuery, useUpdateStepDataMutation } from '@/app/services/apiSlice'
import { useGetClassificationsQuery } from '@/app/services/steps/classifications' 

const ClassificationsStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string 
        }, 
        ref 
    ) => {
    const [ formData, setFormData ] = useState<any>({
        ids: []
    });
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const { data: classifications, isLoading: classificationsIsLoading } = useGetClassificationsQuery();
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( classificationsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    const filter = createFilterOptions();
    useEffect(() => {
        if ( stepData ) {
            setFormData( { ids: stepData } );
        }
    }, [stepData]);
    useEffect(() => {
        dispatch( formValidator( true ) );
    }, []);
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
            ? <StepPlaceholder />
            :
                <div id="classifications" className="tab">
                    <h3 className="mb-4 text-shadow-white">Classifications</h3>
                    {
                        ( props.details !== undefined && props.details !== '' ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {
                        ( 
                            stepGuide === 'string' && 
                            stepGuide.trim() !== '' 
                        ) && (
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
                            </Alert>
                        )
                    }
                    <FormControl className="mb-3">
                        <FormLabel className="fw-bold mb-2">
                            Please Choose
                        </FormLabel>
                        <Autocomplete
                            multiple
                            required
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="ids"
                            id="ids"
                            options={ 
                                Array.isArray( classifications ) 
                                ? classifications.map( 
                                    ( item: any ) => {
                                        return item.attributes?.title || '' 
                                    }
                                ) : []
                            }
                            value={
                                ( 
                                    Array.isArray( classifications ) && 
                                    formData?.ids?.length > 0 
                                )
                                ? classifications
                                    .filter ( 
                                        ( item: any ) => formData?.ids.includes( item.id )
                                    )
                                    .map( ( item: any ) => item.attributes.title )
                                : []
                            }
                            onChange={ ( event, value ) => {
                                const selectedIds = value.map( ( selectedItem ) => {
                                    const selectedOption = classifications.find(
                                        ( item: any ) => item.attributes.title === selectedItem
                                    );

                                    return selectedOption ? selectedOption.id : '';
                                });
                                setFormData({ ids: selectedIds });
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option);
                        
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push('Nothing found');
                                }
                        
                                return filtered.filter( ( option: any ) => {
                                    return option !== 'Nothing found' || isExisting;
                                });
                            }}
                        />
                    </FormControl>
                </div>
    );
});

ClassificationsStep.displayName = 'ClassificationsStep';

export default ClassificationsStep;