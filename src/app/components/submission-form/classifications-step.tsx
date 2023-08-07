import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText, createFilterOptions } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/classificationsSlice'
import { getClassificationsList, getClassificationsStepData, getClassificationsStepGuide, updateClassificationsStepData } from '@/app/api/classifications'
import ReactHtmlParser from 'react-html-parser'

const ClassificationsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        ids: true,
    });
    const filter = createFilterOptions();
    const getAllClassificationsFromApi = `${ wizard.baseUrl }/api/v1/journal/classification`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${wizard.formStep}`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        dispatch( getClassificationsList( getAllClassificationsFromApi ) );
        dispatch( getClassificationsStepData( getStepDataFromApi ) );
        dispatch( getClassificationsStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect(() => {
        if (wizard.isVerified) {
            setIsValid((prevState) => ({
                ...prevState,
                ids: formState.value.ids.length > 0,
            }));
        }
    }, [wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateClassificationsStepData( getStepDataFromApi ) );
        }
    }));

    return (
        <>
            <div id="classifications" className="tab">
                <h3 className="mb-4 text-shadow-white">Classifications</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={formState.value.ids.length === 0 && !isValid.ids}>
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
                            Array.isArray( formState.classificationsList ) 
                            ? formState.classificationsList.map( 
                                ( item: any ) => {
                                    return item.attributes?.title || '' 
                                }
                               ) : []
                        }
                        value={
                            Array.isArray( formState.classificationsList ) && formState.value.ids.length > 0
                              ? formState.classificationsList
                                  .filter( ( item: any ) => formState.value.ids.includes( item.id ) )
                                  .map( ( item: any ) => item.attributes.title )
                              : []
                        }
                        onChange={(event, value) => {
                            const selectedIds = value.map((selectedItem) => {
                              const selectedOption = formState.classificationsList.find(
                                ( item: any ) => item.attributes.title === selectedItem
                              );
                              return selectedOption ? selectedOption.id : '';
                            });
                            dispatch(handleInput({ name: 'ids', value: selectedIds }));
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
                    {
                        ( formState.value.ids.length === 0 && !isValid.ids )
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

ClassificationsStep.displayName = 'ClassificationsStep';

export default ClassificationsStep;