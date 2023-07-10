import { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import { Autocomplete } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleSelection, stepState, formValidation, formValidator } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const SectionStep = () => {
    const dispatch = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const formIsValid = useSelector( formValidation );
    const [ isValid, setIsValid ] = useState({
        section: '',
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
            <div id="section" className={`tab${wizard.formStep === 'section' ? ' active' : ''}`}>
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
                        options={ formState.sections !== undefined ? formState.sections : [] }
                        value={ formState.sections !== undefined ? formState.sections.find( ( item:any ) => item.id === formState.documentSection) || null : null }
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