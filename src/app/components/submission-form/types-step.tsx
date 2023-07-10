import { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import { Autocomplete } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleSelection, stepState, formValidation, formValidator } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const TypesStep = () => {
    const dispatch = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const formIsValid = useSelector( formValidation );
    const [ isValid, setIsValid ] = useState({
        documentType: '',
    });
    useEffect( () => {
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
        dispatch( formValidator( formState.formStep ) );
    }, [formState]);

    return (
        <>
            <div id="types" className={`tab${wizard.formStep === 'types' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Types</h3>
                <FormControl fullWidth>
                    <Autocomplete
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
                </FormControl>
            </div>
        </>
    );
}

export default TypesStep;