import ReactHtmlParser from 'react-html-parser'
import Divider from '@mui/material/Divider'
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { handleCheckbox, stepState, formValidation, formValidator, stepGuide } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const AgreementStep = () => {
    const formState = useSelector( stepState );
    const formIsValid = useSelector( formValidation );
    const stepInstruction = useSelector( stepGuide );
    const wizard = useSelector( wizardState );
    const dispatch = useDispatch();
    const [ isValid, setIsValid ] = useState({
        termsAndConditions: false,
        authorName: false
    });

    useEffect( () => {
        if ( wizard.formStep === 'agreement' ) {
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
            <div id="agreement" className={`tab${wizard.formStep === 'agreement' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                {   stepInstruction.guide !== undefined &&     
                    ReactHtmlParser( stepInstruction.guide )
                }
                <Divider />
                <form name="agreement-form" id="agreement-form">
                    <FormControl className="mb-4" fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    required
                                    name="termsAndConditions"
                                    id="termsAndConditions"
                                    checked={ formState.termsAndConditions === 'on' }
                                    onChange={ event => dispatch ( handleCheckbox( { name: event.target.name, value: formState.termsAndConditions } ) ) }
                                    inputProps={{ 'aria-label': 'terms-and-conditions' }}
                                />
                            }
                            label="I've read and agree to all terms that are mentioned above"
                        />
                        {
                            ( formState.termsAndConditions !== 'on' && !formIsValid ) 
                            && <div className="fs-7 text-danger">Please accept the terms and conditions</div> 
                        }
                    </FormControl>
                </form>
            </div>
        </>
    );
}

export default AgreementStep;