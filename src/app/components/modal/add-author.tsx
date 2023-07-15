import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { Autocomplete, Input, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { modalState, handleInputChange } from '@/app/features/modal/modalSlice'

const AddAuthorModal = () => {
    const dispatch = useDispatch();
    const thunkDispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const modalData = useSelector( modalState );
    const formIsValid = modalData.isFormValid;
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
    const [affiliations, setAffiliations] = useState([{
        id: 1,
        value: modalData.modalFormData.authorAffiliations || '',
        required: true
    }]);
    const [ isValid, setIsValid ] = useState( {
        authorEmail: modalData.modalFormData.authorEmail && modalData.modalFormData.authorEmail !== '',
        authorFirstName: modalData.modalFormData.authorFirstName && modalData.modalFormData.authorFirstName !== '',
        authorLastName: modalData.modalFormData.authorLastName && modalData.modalFormData.authorLastName !== '',
        authorAffiliation: modalData.modalFormData.authorAffiliatio && modalData.modalFormData.authorAffiliation !== ''
    });
    useEffect( () => {
        if ( modalData.modalForm === 'authors' ) {
            const isValidKeys = Object.keys(isValid);
            for ( const [key, value] of Object.entries( modalData.modalFormData ) ) {   
                if ( isValidKeys.includes(key) ) {
                    if ( value === '' ) {
                        setIsValid({ ...isValid, [key]: false });
                    } else {
                        setIsValid({ ...isValid, [key]: true });
                    }
                }
            }
        }
    }, [modalData.modalFormData]);
    const repeatField = () => {
        const newAffiliation = {
          id: affiliations.length + 1,
          value: '',
          required: false
        };
        setAffiliations([...affiliations, newAffiliation]);
      }
    
      const handleAffiliationChange = ( event: any, index: any ) => {
        const updatedAffiliations = [...affiliations];
        updatedAffiliations[index].value = event.target.value;
        setAffiliations(updatedAffiliations);
      }

    return (
        <>
            <FormControl className="mb-3" error={ !isValid.authorEmail && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Email
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="authorEmail"
                    id="authorEmail"
                    placeholder="Author's Email"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorEmail', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.authorEmail && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                }
            </FormControl>
            <FormControl className="mb-3" error={ !isValid.authorFirstName && !formIsValid}>
                <FormLabel className="fw-bold mb-1">
                    First Name
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="authorFirstName"
                    id="authorFirstName"
                    placeholder="Author's First Name"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorFirstName', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.authorFirstName && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                }
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Middle Name
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="authorMiddleName"
                    id="authorMiddleName"
                    placeholder="Author's Middle Name"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorMiddleName', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-3" error={ !isValid.authorLastName && !formIsValid}>
                <FormLabel className="fw-bold mb-1">
                    Last Name
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="authorLastName"
                    id="authorLastName"
                    placeholder="Author's Last Name"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorLastName', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.authorLastName && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                }
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Orcid
                </FormLabel>
                <Input
                    variant="soft"
                    name="authorOrcId"
                    id="authorOrcId"
                    placeholder="Author's Orcid"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorOrcId', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Country
                </FormLabel>
                <Input
                    variant="soft"
                    name="authorCountry"
                    id="authorCountry"
                    placeholder="Country"
                    onChange={ event => dispatch( handleInputChange( { name: 'authorCountry', value: event.target.value } ) ) }
                />
            </FormControl>
            <fieldset className="fieldset mb-4">
                <legend>Phones</legend>
                <div className="d-flex align-items-center">
                    <FormControl className="pe-2 col-md-3">
                        <FormLabel className="fw-bold mb-1">
                            Type
                        </FormLabel>
                        <Autocomplete
                            variant="soft" 
                            id="authorPhoneType"
                            name="authorPhoneType"
                            options={phoneTypes}
                            onChange={ ( event, value ) => dispatch( handleInputChange( { name: 'authorPhoneType', value: value?.label || '' } ) ) }
                        />
                    </FormControl>
                    <FormControl className="pe-2 col-md-4">
                        <FormLabel className="fw-bold mb-1">
                            Country
                        </FormLabel>
                        <Autocomplete
                            variant="soft"     
                            id="authorPhoneCountry"
                            name="authorPhoneCountry"
                            options={countries}
                            onChange={ ( event, value ) => dispatch( handleInputChange( { name: 'authorPhoneCountry', value: value?.label || '' } ) ) }
                        />
                    </FormControl>
                    <FormControl className="col-md-5">
                        <FormLabel className="fw-bold mb-1">
                            Number
                        </FormLabel>
                        <Input
                            variant="soft"
                            name="authorPhoneNumber"
                            id="authorPhoneNumber"
                            placeholder="Author Orcid"
                            onChange={ event => dispatch( handleInputChange( { name: 'authorPhoneNumber', value: event.target.value } ) ) }
                        />
                    </FormControl>
                </div>
            </fieldset>
            <fieldset className="fieldset mb-4">
                <legend>Affiliations</legend>
                {affiliations.map((affiliation, index) => (
                    <FormControl className="mb-3" key={affiliation.id} error={ index === 0 && !isValid.authorAffiliation && !formIsValid}>
                        <FormLabel className="fw-bold mb-1">
                            Affiliation { index !== 0 && (index + 1)}
                        </FormLabel>
                        <Input
                            required={affiliation.required}
                            variant="soft"
                            name={`authorAffiliations_${index}`}
                            id={`authorAffiliations_${index}`}
                            placeholder="Author Affiliation(s)"
                            value={affiliation.value}
                            onChange={event => handleAffiliationChange(event, index)}
                        />
                        {
                            ( index === 0 && !isValid.authorAffiliation && !formIsValid) && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText>
                        }
                    </FormControl>
                ))}
                <Button className="btn btn-primary btn-lg mb-4" onClick={() => repeatField()}>
                    Add Affiliation
                </Button>
            </fieldset>
        </>
    );
}

export default AddAuthorModal;