import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText, createFilterOptions, CircularProgress } from '@mui/joy'
import { wizardState, formValidator, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput, handleKeywordsList, emptyKeywordsList } from '@/app/features/submission/keywordsSlice'
import { getKeywordsList, getKeywordsStepData, getKeywordsStepGuide, updateKeywordsStepData, addNewKeyword, getKeywords, findKeywords } from '@/app/api/keywords'
import ReactHtmlParser from 'react-html-parser'

const KeywordsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        ids: true,
    });
    const filter = createFilterOptions();
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllKeywordsFromApi = `${ wizard.baseUrl }/api/v1/journal/keyword`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${wizard.formStep}`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    const loading = formState.isLoading;
    useEffect( () => {
        dispatch( getKeywordsList( getAllKeywordsFromApi ) );
        dispatch( getKeywordsStepData( getStepDataFromApi ) );
        dispatch( getKeywordsStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);


    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if (wizard.isVerified) {
            setIsValid((prevState) => ({
                ...prevState,
                ids: formState.value.ids.length > 0,
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useEffect( () => {
        if ( formState.value.ids.length > 0 ) {
            formState.value.ids.map( ( item: any ) => {
                const findKeywordInApi = `${ getAllKeywordsFromApi }/${ item }`;
                dispatch( getKeywords( findKeywordInApi ) );
            });
        }
    }, [formState.isInitialized]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          let isAllowed = false;   
          try {
            await dispatch( updateKeywordsStepData( getStepDataFromApi ) );
            
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));

    return (
        <>
            <div id="keywords" className="tab">
                <h3 className="mb-4 text-shadow-white">Keywords</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={ wizard.isVerified && formState.ids === '' && !isValid.ids }>
                    <FormLabel className="fw-bold mb-2">
                        Please Choose
                    </FormLabel>
                    <Autocomplete
                        multiple
                        required
                        freeSolo
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Choose one…"
                        disabled={false}
                        name="documentKeywords"
                        id="documentKeywords"
                        loading={ loading }
                        endDecorator={
                            loading ? (
                              <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                            ) : null
                        }
                        options={ formState.keywordsBuffer.length > 0 
                            ? formState.keywordsBuffer.map( ( item: any ) => item.attributes?.title )
                            : []
                        }
                        value={ formState.keywordsList.length > 0 
                            ? formState.keywordsList.map( ( item: any ) => item?.attributes?.title )
                            : [] 
                        }
                        onInputChange={ ( event, value ) =>  {
                            if ( value.length > 0 ) {
                                const findKeywordInApi = `${ getAllKeywordsFromApi }?filter[title]=${ value }`;
                                dispatch( findKeywords( findKeywordInApi ) )
                            }
                        }}
                        onChange={ ( event, value, reason ) => {
                            !wizard.isVerified && dispatch( handleIsVerified() );
                            const selectedIds: any = [];
                            if ( reason === 'selectOption' ) {
                                const findKeywordInApi = `${ getAllKeywordsFromApi }?filter[title]=${ value }`;
                                dispatch( findKeywords( findKeywordInApi ) );
                                if ( value.length > 0 && formState.keywordsBuffer.length === 0 ) {
                                    dispatch( addNewKeyword( { url: getAllKeywordsFromApi, keyword: value[value.length - 1] } ) );
                                } else {
                                    const selectedOption = formState.keywordsBuffer.find( ( item: any ) =>
                                        item.attributes.title === value[value.length - 1]
                                    );
                                    selectedIds.push( selectedOption?.id );
                                    dispatch( handleKeywordsList( selectedOption ) );
                                    dispatch( handleInput( { name: 'ids', value: selectedIds } ) );
                                }   
                            }
                            if ( reason === 'removeOption' ) {
                                dispatch( emptyKeywordsList() );
                                value.map( ( title: any ) => {
                                    const selectedOption = formState.keywordsList.find( ( item: any ) => item.attributes.title === title );
                                    dispatch( handleKeywordsList( selectedOption ) );
                                    selectedIds.push( selectedOption?.id );
                                });
                                dispatch( handleInput( { name: 'ids', value: selectedIds } ) );
                            } 
                        }}
                        filterOptions={ ( options, params ) => {
                            if ( formState.isLoading ) {
                                return ['Please wait...'];
                            }
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some((option) =>
                                inputValue === option
                            );
                            if (inputValue !== '' && !isExisting) {
                                filtered.push( inputValue );
                            }
                        
                            return filtered;
                        }}
                        getOptionDisabled={ ( option: any ) =>
                            option === 'Please wait...'
                        }

                    />
                    {
                        ( wizard.isVerified && formState.ids === '' && !isValid.ids ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should enter at least one keyword</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

KeywordsStep.displayName = 'KeywordsStep';

export default KeywordsStep;