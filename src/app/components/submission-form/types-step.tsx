import { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import { Autocomplete } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleSelection, stepState, formValidation, formValidator } from './../../features/submission/submissionSlice'

const TypesStep = ({ formStep }) => {
    const dispatch = useDispatch();
    const formData = useSelector( stepState );
    const formIsValid = useSelector( formValidation );
    const [ isValid, setIsValid ] = useState({
        documentType: '',
    });
    useEffect( () => {
        const isValidKeys = Object.keys(isValid);
        for ( const [key, value] of Object.entries( formData ) ) {   
            if ( isValidKeys.includes(key) ) {
                if ( value === '' ) {
                    setIsValid({ ...isValid, [key]: false });
                } else {
                    setIsValid({ ...isValid, [key]: true });
                }
            }
        }
        dispatch( formValidator( formStep ) );
    }, [formData]);

    return (
        <>
            <div id="types" className={`tab${formStep === 'types' ? ' active' : ''}`}>
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
                        options={formData.types}
                        value={ formData.types !== undefined ? formData.types.find((item) => item.id === formData.documentType) || null : null }
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