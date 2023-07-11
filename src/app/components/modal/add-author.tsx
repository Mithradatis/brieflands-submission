import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField } from '@mui/material'
import { formValidator } from '@/app/features/submission/submissionSlice'
import { modalState, handleInputChange } from '@/app/features/modal/modalSlice'
import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'

const AddAuthrrModal = () => {
    const dispatch = useDispatch();
    const modalFormData = useSelector( modalState );
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
    const [ isValid, setIsValid ] = useState( {
        authorEmail: modalFormData.authorEmail !== '',
        authorFirstName: modalFormData.authorFirstName !== '',
        authorLastName: modalFormData.authorLastName !== ''
    });
    const [ formIsValid, setFormIsValid ] = useState( true );
    useEffect( () => {
        const isValidKeys = Object.keys(isValid);
        for ( const [key, value] of Object.entries( modalFormData ) ) {    
            if ( isValidKeys.includes(key) ) {
                if ( value === '' ) {
                    setIsValid({ ...isValid, [key]: false });
                } else {
                    setIsValid({ ...isValid, [key]: true });
                }
            }
        }
    }, [modalFormData, isValid]);

    return (
        <>
            <FormControl className="mb-4" fullWidth>
                <TextField
                    name="authorEmail"  
                    id="authorEmail"
                    label="Email" 
                    variant="outlined" 
                    onChange={ event => dispatch( handleInputChange( { name: 'authorEmail', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField
                    name="authorFirstName" 
                    id="authorFirstName" 
                    label="First Name" 
                    variant="outlined"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorFirstName', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField
                    name="authorMiddleName" 
                    id="authorMiddleName" 
                    label="Middle Name" 
                    variant="outlined"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorMiddleName', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField
                    name="authorLastName"  
                    id="authorLastName" 
                    label="Last Name" 
                    variant="outlined"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorLastName', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField
                    name="authorOrcId"  
                    id="authorOrcId" 
                    label="orcid" 
                    variant="outlined"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorOrcId', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl fullWidth className="mb-4">
                <Autocomplete
                    disablePortal
                    id="authorCountry"
                    options={countries}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                    onChange={ ( event, value ) => dispatch( handleInputChange( { name: 'authorCountry', value: value?.label || '' } ) ) }
                />
            </FormControl>
            <fieldset className="fieldset mb-4">
                <legend>Phones</legend>
                <div className="d-flex align-items-center">
                    <FormControl className="pe-3" fullWidth>
                        <Autocomplete
                            disablePortal 
                            id="authorPhoneType"
                            options={phoneTypes}
                            renderInput={(params) => <TextField {...params} label="Type" />}
                            onChange={ ( event, value ) => dispatch( handleInputChange( { name: 'authorPhoneType', value: value?.label || '' } ) ) }
                        />
                    </FormControl>
                    <FormControl className="pe-3" fullWidth>
                        <Autocomplete
                            disablePortal 
                            id="authorPhoneCountry"
                            options={countries}
                            renderInput={(params) => <TextField {...params} label="Country" />}
                            onChange={ ( event, value ) => dispatch( handleInputChange( { name: 'authorPhoneCountry', value: value?.label || '' } ) ) }
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            name="authorPhoneNumber"  
                            id="authorPhoneNumber" 
                            label="Number" 
                            variant="outlined"
                            onChange={ event => dispatch( handleInputChange( { name: 'authorPhoneNumber', value: event.target.value } ) ) }
                        />
                    </FormControl>
                </div>
            </fieldset>
            <fieldset className="fieldset mb-4">
                <legend>Affiliations</legend>
                <FormControl fullWidth>
                    <TextField
                        name="authorAffiliations" 
                        id="authorAffiliations" 
                        label="Affiliations"
                        variant="outlined"
                        onChange={ event => dispatch( handleInputChange( { name: 'authorAffiliations', value: event.target.value } ) ) }
                    />
                </FormControl>
            </fieldset>
        </>
    );
}

export default AddAuthrrModal;