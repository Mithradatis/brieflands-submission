import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, createFilterOptions } from '@mui/joy'
import { formValidator } from '@/lib/features/wizard/wizardSlice'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/classifications/classificationsSlice'
import { 
    getClassificationsList, 
    getClassificationsStepData, 
    getClassificationsStepGuide, 
    updateClassificationsStepData 
} from '@/lib/api/steps/classifications'

const ClassificationsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.classificationsSlice );
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const filter = createFilterOptions();
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllClassificationsFromApi = `${ process.env.API_URL }/journal/classification`;
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${wizard.formStep}`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'classifications' ) {
            dispatch( getClassificationsList( getAllClassificationsFromApi ) );
            dispatch( getClassificationsStepData( getStepDataFromApi ) );
            dispatch( getClassificationsStepGuide( getDictionaryFromApi ) );
            dispatch( formValidator( true ) );
        }
    }, []);
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
                            Array.isArray( formState.classificationsList ) && formState.value?.ids.length > 0
                              ? formState.classificationsList
                                  .filter( ( item: any ) => formState.value?.ids.includes( item.id ) )
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