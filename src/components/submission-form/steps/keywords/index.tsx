import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formValidator, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { 
    Autocomplete,
    FormControl, 
    FormLabel, 
    FormHelperText, 
    createFilterOptions, 
    CircularProgress 
} from '@mui/joy'
import { 
    handleInput, 
    handleKeywordsList, 
    handleLoading, 
    emptyKeywordsList, 
    resetKeywordsBuffer 
} from '@/lib/features/submission/steps/keywords/keywordsSlice'
import { 
    getKeywordsList, 
    getKeywordsStepData, 
    getKeywordsStepGuide, 
    updateKeywordsStepData, 
    addNewKeyword, 
    getKeywords, 
    findKeywords 
} from '@/lib/api/steps/keywords'

const KeywordsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.keywordsSlice );
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const [ isValid, setIsValid ] = useState({
        ids: true,
    });
    const filter = createFilterOptions();
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllKeywordsFromApi = `${ process.env.API_URL }/journal/keyword`;
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${wizard.formStep}`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    const searching = formState.isSearching;
    useEffect( () => {
        if ( wizard.formStep === 'keywords' ) {
            dispatch( getKeywordsList( getAllKeywordsFromApi ) );
            dispatch( getKeywordsStepData( getStepDataFromApi ) );
            dispatch( getKeywordsStepGuide( getDictionaryFromApi ) );
        }
    }, []);
    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if (wizard.isVerified) {
            setIsValid((prevState) => ({
                ...prevState,
                ids: formState.value?.ids.length > 0,
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useEffect( () => {
        if ( formState.value?.ids.length > 0 ) {
            formState.value?.ids.map( ( item: any ) => {
                const findKeywordInApi = `${ getAllKeywordsFromApi }/${ item }`;
                dispatch( getKeywords( findKeywordInApi ) );
            });
        }
    }, [formState.isInitialized]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
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
            <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="keywords" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Keywords</h3>
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
                        loading={ searching }
                        endDecorator={
                            searching ? (
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
                        onInputChange={ async ( event, value ) =>  {
                            if ( value.length > 0 ) {
                                const findKeywordInApi = `${ getAllKeywordsFromApi }?filter[title]=${ value }`;
                                await dispatch( findKeywords( findKeywordInApi ) )
                            }
                        }}
                        onChange={ ( event, value, reason ) => {
                            !wizard.isVerified && dispatch(handleIsVerified());
                            const selectedIds: any = [];
                            const handleKeywordSelection = async ( keyword: any ) => {
                              if ( value.length > 0 ) {
                                const findKeywordInApi = `${getAllKeywordsFromApi}?filter[title]=${ keyword }`;
                                await dispatch( findKeywords( findKeywordInApi ) );
                                let isNewKeyword = true;
                                isNewKeyword = !formState.keywordsBuffer.some( ( item: any ) => item.attributes.title === value );
                                if ( isNewKeyword ) {
                                  await dispatch( addNewKeyword( { url: getAllKeywordsFromApi, keyword: keyword } ) );
                                } else {
                                  const selectedOptions: any = [];
                                  value.forEach( ( keyword ) => {
                                    const selectedOption = formState.keywordsBuffer.find( ( item: any ) => item.attributes.title === keyword);
                                    selectedOptions.push( selectedOption?.id );
                                    dispatch( handleKeywordsList( selectedOption ) );
                                  });
                                  await dispatch( handleInput( { name: 'ids', value: selectedOptions } ) );
                                }
                              }  
                            };
                            if (reason === 'selectOption') {
                              handleKeywordSelection( value[value.length - 1 ] );
                            }
                            if (reason === 'removeOption') {
                              dispatch(emptyKeywordsList());
                              value.forEach((title) => {
                                const selectedOption = formState.keywordsList.find( ( item: any ) => item.attributes.title === title);
                                dispatch( handleKeywordsList( selectedOption ) );
                                selectedIds.push( selectedOption?.id );
                              });
                              dispatch( handleInput( { name: 'ids', value: selectedIds } ) );
                            }
                            dispatch( resetKeywordsBuffer() );
                        }}
                        filterOptions={ ( options, params ) => {
                            if ( formState.isSearching ) {
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