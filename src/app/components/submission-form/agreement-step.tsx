import Divider from '@mui/material/Divider'
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { handleCheckbox, handleInputText, stepState, formValidation, formValidator } from './../../features/submission/submissionSlice'
 
const AgreementStep = ({ formStep }) => {
    const formData = useSelector( stepState );
    const formIsValid = useSelector( formValidation );
    const dispatch = useDispatch();
    const [ isValid, setIsValid ] = useState({
        termsAndConditions: false,
        authorName: false
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
            <div id="agreement" className={`tab${formStep === 'agreement' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                    <h4 className="fs-6">1. Download a Manuscript Template</h4>
                    <h4 className="fs-6">2. Write Your Manuscript using a checklist</h4>
                    <Divider className="mb-3 mt-2" />
                    <h4 className="fs-6">Author Disclusure</h4>
                    <ul className="text-muted fs-7">
                        <li>I accept to pay  Article Processing Charges after accepting our manuscript.</li>
                        <li>I assign all rights to the journal and I will not withdraw my article by the final decision by the journal. Otherwise, I accept to pay the  withdrawal penalty fee.</li>
                        <li>I accept all "Ethical Considerations in Instruction for Authors."</li>
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
                                    checked={ formData.termsAndConditions === 'on' }
                                    onChange={ event => dispatch ( handleCheckbox({ name: event.target.name }) ) }
                                    inputProps={{ 'aria-label': 'terms-and-conditions' }}
                                />
                            }
                            label="I've read and agree to all terms that are mentioned above"
                        />
                        {
                            ( formData.termsAndConditions !== 'on' && !formIsValid ) 
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
                            value={ formData.authorName }
                            onChange={ event => dispatch( handleInputText( { name: 'authorName', value: event.target.value } ) ) }
                            InputLabelProps={{
                                shrink: formData.authorName !== '',
                            }}
                        />
                    </FormControl>
                </form>
            </div>
        </>
    );
}

export default AgreementStep;