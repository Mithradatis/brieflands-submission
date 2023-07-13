import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect } from 'react'
import { Alert, AlertTitle } from '@mui/material'
import { Autocomplete, FormHelperText, Input, FormLabel, FormControl } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleInputText, handleSelection, stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const TypesStep = () => {
    const dispatch = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const formIsValid = useSelector( formValidation );
    const typesStepGuide = useSelector( stepGuide );
    const [ isValid, setIsValid ] = useState({
        documentType: '',
        documentTitle: ''
    });
    useEffect( () => {
        if ( wizard.formStep === 'types' ) {
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
            <div id="types" className={`tab${wizard.formStep === 'types' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Types</h3>
                <Alert severity="info" className="mb-4">
                    <AlertTitle>Important Note</AlertTitle>
                    { ReactHtmlParser( typesStepGuide.guide ) }
                </Alert>
                <FormControl className="mb-3" error={formState.documentType === '' && !formIsValid}>
                    <FormLabel className="fw-bold mb-1">
                        Manuscript Type
                    </FormLabel>
                    <Autocomplete
                        required
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Choose one…"
                        disabled={false}
                        name="documentType"
                        id="documentType"
                        options={ formState.types !== undefined ? formState.types : [] }
                        value={ formState.types !== undefined ? formState.types.find( ( item: any ) => item.id === formState.documentType) || null : null }
                        onChange={(event, value) => {
                            const selectedId = value ? value.id : '';
                            dispatch(handleSelection({ name: 'documentType' , value: selectedId }));
                        }}
                    />
                    {
                        ( formState.documentType === '' && !formIsValid ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
                <FormControl className="mb-3" error={formState.documentTitle === '' && !formIsValid}>
                    <FormLabel className="fw-bold mb-1">
                        Title
                    </FormLabel>
                    <Input
                        required
                        variant="soft"
                        name="documentTitle"
                        id="documentTitle"
                        placeholder="Manuscript Title"
                        value={ formState.documentTitle }
                        onChange={ event => dispatch( handleInputText( { name: event.target.name, value: event.target.value } ) ) }
                    />
                    {
                        ( formState.documentTitle === '' && !formIsValid ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
}

export default TypesStep;