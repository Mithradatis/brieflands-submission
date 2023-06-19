import Divider from '@mui/material/Divider'
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'

const AgreementStep = forwardRef(( props, ref ) => {
    const { formStep } = props;
    const [formData, setFormData] = useState({
        termsAndConditions: '',
        authorName: ''
      });
    const [ isChecked , setIsChecked ] = useState( formData.termsAndConditions === 'on' );
    const [ formIsValid, setFormIsValid ] = useState( true );
    const [ isValid, setIsValid ] = useState( {
        termsAndConditions: formData.termsAndConditions !== '',
        authorName: formData.authorName !== ''
    });
    const handleCheckbox = () => {
        setIsChecked( !isChecked );
    }
    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormData( prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }
    useEffect( () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            termsAndConditions: isChecked ? 'on' : ''
          }));
        setIsValid( { ...isValid, termsAndConditions: isChecked } );  
    }, [isChecked]);
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
    }, [formData]);
    const formValidator = () => {
        const allInputsFilled = Object.values( isValid ).every(
            value => value === true
        );
        !allInputsFilled && setFormIsValid( false );

        return allInputsFilled;
    }
    useImperativeHandle(ref, () => ({
        formValidator: formValidator
    }));

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
                                    checked={ isChecked ? 'checked' : '' }
                                    onChange={handleCheckbox}
                                    inputProps={{ 'aria-label': 'Checkbox' }}
                                />
                            }
                            label="I've read and agree to all terms that are mentioned above"
                        />
                        { 
                            ( !isChecked && !formIsValid ) 
                            && <div className="fs-7 text-danger">Please accept the terms and conditions</div> 
                        }
                    </FormControl>   
                    <FormControl className="mb-4" fullWidth>
                        <TextField
                            required
                            error={ !formIsValid && !isValid.authorName } 
                            name="authorName"
                            id="author-full-name" 
                            label="Author's Full Name" 
                            variant="outlined"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </form>
            </div>
        </>
    );
});

export default AgreementStep;