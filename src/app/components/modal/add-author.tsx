import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material';

const AddAuthrrModal = forwardRef((props, ref) => {
    const { modalCalledFormData, setModalCalledFormData } = props;
    const authorEmail = useRef('');
    const authorFirstName = useRef('');
    const authorMiddleName = useRef('');
    const authorLastName = useRef('');
    const authorCountry = useRef('');
    const authorPhoneType = useRef('');
    const authorPhoneCountry = useRef('');
    const authorPhoneNumber = useRef('');
    const authorAffiliations = useRef('');
    const phoneTypes = [
        { id: 1, label: 'Mobile' },
        { id: 2, label: 'Home' },
        { id: 3, label: 'Work' },
        { id: 4, label: 'Fax' }
    ];
    const countries = [
        { label: 'Iran', id: 1 },
        { label: 'Afghanistan', id: 2 },
        { label: 'Tajikistan', id: 3 },
    ];
    const saveModal = () => {
        const authors = {
            email: authorEmail.current.value, 
            name: `${ authorFirstName.current.value } ${ authorMiddleName.current.value } ${ authorLastName.current.value }` 
        };    
        setModalCalledFormData( [...modalCalledFormData, authors] );
    }
    const [formData, setFormData] = useState({
        termsAndConditions: '',
        authorName: ''
    });
    const [ formIsValid, setFormIsValid ] = useState( true );
    const [ isValid, setIsValid ] = useState( {
        termsAndConditions: formData.termsAndConditions !== '',
        authorName: formData.authorName !== ''
    });
    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormData( prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    }
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
        saveModal: saveModal
    }));

    return (
        <>
            <FormControl className="mb-4" fullWidth>
                <TextField 
                    id="author-email" 
                    label="Email" 
                    variant="outlined" 
                    inputRef={authorEmail}
                    onChange={handleInputChange}
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField 
                    id="author-firstname" 
                    label="First Name" 
                    variant="outlined" 
                    inputRef={authorFirstName}
                    onChange={handleInputChange}
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField 
                    id="author-middle-name" 
                    label="Middle Name" 
                    variant="outlined" 
                    inputRef={authorMiddleName}
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField 
                    id="author-lastname" 
                    label="Last Name" 
                    variant="outlined" 
                    inputRef={authorLastName} 
                    onChange={handleInputChange}
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField id="author-orcid" label="orcid" variant="outlined"/>
            </FormControl>
            <FormControl fullWidth className="mb-4">
                <Autocomplete
                    disablePortal
                    id="author-country"
                    options={countries}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                    onChange={handleInputChange}
                />
            </FormControl>
            <fieldset className="fieldset mb-4">
                <legend>Phones</legend>
                <div className="d-flex align-items-center">
                    <FormControl className="pe-3" fullWidth>
                        <Autocomplete
                            disablePortal
                            id="author-phone-type"
                            options={phoneTypes}
                            renderInput={(params) => <TextField {...params} label="Type" />}
                        />
                    </FormControl>
                    <FormControl className="pe-3" fullWidth>
                        <Autocomplete
                            disablePortal
                            id="author-phone-country"
                            options={countries}
                            renderInput={(params) => <TextField {...params} label="Country" />}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField id="author-phone-number" label="Number" variant="outlined"/>
                    </FormControl>
                </div>
            </fieldset>
            <fieldset className="fieldset mb-4">
                <legend>Affiliations</legend>
                <FormControl fullWidth>
                    <TextField
                        id="author-affiliations" 
                        label="Affiliations"
                        variant="outlined"
                        onChange={handleInputChange}
                    />
                </FormControl>
            </fieldset>
        </>
    );
});

export default AddAuthrrModal;