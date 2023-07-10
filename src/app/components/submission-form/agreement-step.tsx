import Divider from '@mui/material/Divider'
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { handleCheckbox, handleInputText, stepState, formValidation, formValidator } from '@/app/features/submission/submissionSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

const AgreementStep = () => {
    const formState = useSelector( stepState );
    const formIsValid = useSelector( formValidation );
    const wizard = useSelector( wizardState );
    const dispatch = useDispatch();
    const [ isValid, setIsValid ] = useState({
        termsAndConditions: false,
        authorName: false
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
        dispatch( formValidator( wizard.formStep ) );
    }, [formState]);

    return (
        <>
            <div id="agreement" className={`tab${wizard.formStep === 'agreement' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                    <h4 className="fs-6">1. Download a Manuscript Template</h4>
                    <h4 className="fs-6">2. Write Your Manuscript using a checklist</h4>
                    <Divider className="mb-3 mt-2" />
                    <h4 className="fs-6">Author Disclusure</h4>
                    <ul className="text-muted fs-7">
                        <li>I accept to pay  Article Processing Charges after accepting our manuscript.</li>
                        <li>I assign all rights to the journal and I will not withdraw my article by the final decision by the journal. Otherwise, I accept to pay the  withdrawal penalty fee.</li>
                        <li>I accept all Ethical Considerations in Instruction for Authors.</li>
                    </ul>
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
                    <FormControl className="mb-4" fullWidth>
                        <TextField
                            required
                            error={ !formIsValid && !isValid.authorName } 
                            name="authorName"
                            id="authorName" 
                            label="Author's Full Name" 
                            variant="outlined"
                            value={ formState.authorName }
                            onChange={ event => dispatch( handleInputText( { name: 'authorName', value: event.target.value } ) ) }
                            InputLabelProps={{
                                shrink: formState.authorName !== '',
                            }}
                        />
                    </FormControl>
                </form>
            </div>
        </>
    );
}

export default AgreementStep;