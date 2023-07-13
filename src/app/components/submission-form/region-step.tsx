import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect } from 'react'
import { Alert } from '@mui/material'
import { Autocomplete, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { useDispatch, useSelector } from 'react-redux'
import { handleSelection, stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const RegionStep = () => {
    const dispatch = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const formIsValid = useSelector( formValidation );
    const stepInstruction = useSelector( stepGuide );
    const [ isValid, setIsValid ] = useState({
        authorRegion: '',
    });
    useEffect( () => {
        if ( wizard.formStep === 'region' ) {
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
            console.log( formState.documentSection );
            dispatch( formValidator( wizard.formStep ) );
        }
    }, [formState]);

    return (
        <>
            <div id="region" className={`tab${wizard.formStep === 'region' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Region</h3>
                {   stepInstruction.guide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( stepInstruction.guide ) }
                    </Alert>
                }
                <FormControl className="mb-3" error={formState.documentSection === '' && !formIsValid}>
                    <FormLabel className="fw-bold mb-1">
                        Choose Region
                    </FormLabel>
                    <Autocomplete
                        required
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Choose one…"
                        disabled={false}
                        name="authorRegion"
                        id="authorRegion"
                        options={ formState.regions !== undefined ? formState.regions : [] }
                        value={ formState.regions !== undefined ? formState.regions.find( ( item:any ) => item.id === formState.authorRegion) || null : null }
                        onChange={(event, value) => {
                            const selectedId = value ? value.id : '';
                            dispatch(handleSelection({ name: 'authorRegion' , value: selectedId }));
                        }}
                    />
                    {
                        ( formState.authorRegion === '' && !formIsValid ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
}

export default RegionStep;