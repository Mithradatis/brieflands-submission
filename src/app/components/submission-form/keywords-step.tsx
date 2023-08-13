import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText, createFilterOptions } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
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
    const getAllKeywordsFromApi = `${ wizard.baseUrl }/api/v1/journal/keyword`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${wizard.formStep}`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect( () => {
        dispatch( getKeywordsList( getAllKeywordsFromApi ) );
        dispatch( getKeywordsStepData( getStepDataFromApi ) );
        dispatch( getKeywordsStepGuide( getDictionaryFromApi ) );
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
    useEffect( () => {
        if ( formState.value.ids.length > 0 ) {
            formState.value.ids.map( ( item: any ) => {
                const findKeywordInApi = `${ getAllKeywordsFromApi }/${ item }`;
                dispatch( getKeywords( findKeywordInApi ) );
            });
        }
    }, [formState.isInitialized]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateKeywordsStepData( getStepDataFromApi ) );
        }
    }));

    return (
        <>
            <div id="keywords" className="tab">
                <h3 className="mb-4 text-shadow-white">Keywords</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={ formState.ids === '' && !isValid.ids }>
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
                    />
                    {
                        ( formState.ids === '' && !isValid.ids ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should enter at least one keyword</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

KeywordsStep.displayName = 'KeywordsStep';

export default KeywordsStep;