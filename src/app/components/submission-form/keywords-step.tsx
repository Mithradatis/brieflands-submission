import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText, createFilterOptions } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/keywordsSlice'
import { getKeywordsList, getKeywordsStepData, getKeywordsStepGuide, updateKeywordsStepData } from '@/app/api/keywords'
import ReactHtmlParser from 'react-html-parser'

const KeywordsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        ids: true,
    });
    const filter = createFilterOptions();
    const getAllKeywordsFromApi = `http://apcabbr.brieflands.com.test/api/v1/journal/keyword`;
    const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${wizard.formStep}`;
    const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect( () => {
        if ( wizard.formStep === 'keywords' ) {
            dispatch( getKeywordsList( getAllKeywordsFromApi ) );
            dispatch( getKeywordsStepData( getStepDataFromApi ) );
            dispatch( getKeywordsStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'keywords' ) {
            const formIsValid = Object.values( formState.value ).every(value => value !== '');
            dispatch( formValidator( formIsValid ) );
        }
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect(() => {
        if ( wizard.formStep === 'keywords' ) {
            if (wizard.isVerified) {
                setIsValid((prevState) => ({
                    ...prevState,
                    ids: formState.value.ids.length > 0,
                }));
            }
        }
    }, [wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateKeywordsStepData( getStepDataFromApi ) );
        }
    }));

    return (
        <>
            <div id="keywords" className={`tab${wizard.formStep === 'keywords' ? ' active' : ''}`}>
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
                        options={ 
                            Array.isArray( formState.keywordsList ) 
                            ? formState.keywordsList.map( 
                                ( item: any ) => {
                                    return item.attributes?.title || '' 
                                }
                               ) : []
                        }
                        value={
                            Array.isArray( formState.keywordsList ) && formState.value.ids.length > 0
                              ? formState.keywordsList
                                  .filter( ( item: any ) => formState.value.ids.includes( parseInt( item.id ) ) )
                                  .map( ( item: any ) => item.attributes.title )
                              : []
                        }
                        onChange={(event, value) => {
                            const selectedIds = value.map(
                                ( title: string ) =>
                                    parseInt( formState.keywordsList.find( ( item: any ) => item.attributes.title === title)?.id )
                            );
                            dispatch( handleInput( { name: 'ids', value: selectedIds } ) );
                        }}
                        filterOptions={ ( options, params ) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some((option) =>
                                inputValue === option
                            );
                            if (inputValue !== '' && !isExisting) {
                                filtered.push(inputValue);
                            }
                        
                            return filtered;
                        }}
                    />
                    {
                        ( formState.ids === '' && !isValid.ids ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

export default KeywordsStep;