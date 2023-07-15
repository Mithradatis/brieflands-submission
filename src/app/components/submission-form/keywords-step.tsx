import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect } from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText, createFilterOptions } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleSelection, stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { keywordsList, handleKeywordsList } from '@/app/features/submission/keywordsSlice'
import { getKeywordsList } from '@/app/api/client'

const KeywordsStep = () => {
    const dispatch = useDispatch();
    const thunkDispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const formIsValid = useSelector( formValidation );
    const stepInstruction = useSelector( stepGuide );
    const keywords = useSelector( keywordsList );
    const [ isValid, setIsValid ] = useState({
        documentKeywords: '',
    });
    const filter = createFilterOptions();
    useEffect( () => {
        if ( wizard.formStep === 'keywords' ) {
            thunkDispatch( getKeywordsList( './../api/keywords-list.json' ) );
            const isValidKeys = Object.keys(isValid);
            for ( const [key, value] of Object.entries( formState ) ) {   
                if ( isValidKeys.includes(key) ) {
                    if ( value === '' ) {
                        setIsValid({ ...isValid, [key]: false });
                    } else {
                        setIsValid({ ...isValid, [key]: true });
                    }
                }
            }
            dispatch( formValidator( wizard.formStep ) );
        }
    }, [formState]);

    return (
        <>
            <div id="keywords" className={`tab${wizard.formStep === 'keywords' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Keywords</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={formState.documentKeywords === '' && !formIsValid}>
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
                        options={ Array.isArray( keywords ) ? keywords : [] }
                        value={formState.documentKeywords || []}
                        onChange={(event, value) => {
                            dispatch( handleSelection({ name: 'documentKeywords', value }) );
                            dispatch( handleKeywordsList( value ) );
                        }}
                        filterOptions={(options, params) => {
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
                        ( formState.documentSection === '' && !formIsValid ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
}

export default KeywordsStep;