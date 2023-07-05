import { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import { Autocomplete } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleSelection, stepState, formValidation, formValidator } from './../../features/submission/submissionSlice'

const SectionStep = ({ formStep }) => {
    const dispatch = useDispatch();
    const formData = useSelector( stepState );
    const formIsValid = useSelector( formValidation );
    const [ isValid, setIsValid ] = useState({
        section: '',
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
            <div id="section" className={`tab${formStep === 'section' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Section</h3>
                <FormControl fullWidth>
                    <Autocomplete
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Choose one…"
                        disabled={false}
                        name="documentSection"
                        id="documentSection"
                        options={formData.sections}
                        value={ formData.sections !== undefined ? formData.sections.find((item) => item.id === formData.documentSection) || null : null }
                        onChange={(event, value) => {
                            const selectedId = value ? value.id : '';
                            dispatch(handleSelection({ name: 'documentSection' , value: selectedId }));
                        }}
                    />
                </FormControl>
            </div>
        </>
    );
}

export default SectionStep;