import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, createFilterOptions } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput, handleLoading } from '@/app/features/submission/classificationsSlice'
import { getClassificationsList, getClassificationsStepData, getClassificationsStepGuide, updateClassificationsStepData } from '@/app/api/classifications'
import ReactHtmlParser from 'react-html-parser'

const ClassificationsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const filter = createFilterOptions();
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllClassificationsFromApi = `${ wizard.baseUrl }/api/v1/journal/classification`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${wizard.formStep}`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        dispatch( getClassificationsList( getAllClassificationsFromApi ) );
        dispatch( getClassificationsStepData( getStepDataFromApi ) );
        dispatch( getClassificationsStepGuide( getDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );
          let isAllowed = false;   
          try {
            await dispatch( updateClassificationsStepData( getStepDataFromApi ) );
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
            <div id="classifications" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Classifications</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' && (
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
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
                </FormControl>
            </div>
        </>
    );
});

ClassificationsStep.displayName = 'ClassificationsStep';

export default ClassificationsStep;