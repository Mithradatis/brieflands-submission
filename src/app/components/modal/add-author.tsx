import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { Autocomplete, Checkbox, Input, FormControl, FormLabel, FormHelperText } from '@mui/joy'
import { modalState } from '@/app/features/modal/modalSlice'
import { handleInput, handleInputAsArray, handleInputArray, addAuthorModalState, handleCheckbox } from '@/app/features/modal/addAuthorModalSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { searchPeople } from '@/app/api/author'

const AddAuthorModal = () => {
    const wizard = useSelector( wizardState );
    const dispatch: any = useDispatch();
    const modalData = useSelector( modalState );
    const addAuthorModalData: any = useSelector( addAuthorModalState );
    const formIsValid = modalData.isFormValid;
    const phoneTypes = [
        { id: 1, label: 'Mobile', value: 'mobile' },
        { id: 2, label: 'Home', value: 'home' },
        { id: 3, label: 'Work', value: 'work' },
        { id: 4, label: 'Fax', value: 'fax' }
    ];
    const [ authorEmailInputValue, setAuthorEmailInputValue ] = useState('');
    const [ authorCountryInputValue, setAuthorCountryInputValue ]: any = useState({});
    const [ authorPhoneTypeInputValue, setAuthorPhoneTypeInputValue ]: any = useState({});
    const [ authorPhoneCountryInputValue, setAuthorPhoneCountryInputValue ]: any = useState({});
    const [affiliations, setAffiliations] = useState([{
        id: 1,
        value: addAuthorModalData.value['affiliations'] || '',
        required: true
    }]);
    const [ isValid, setIsValid ] = useState({
        'email': false,
        'first-name': false,
        'last-name': false,
        'country': false,
        'phone_type': false,
        'country_phone': false,
        'phone_number': false,
        'affiliations': false,
        'correspond_affiliation': false
    });
    useEffect( () => {
        setIsValid( prevIsValid => ({
            ...prevIsValid,
            'email': addAuthorModalData.value['email'] !== undefined && addAuthorModalData.value['email'] !== '',
            'first-name': addAuthorModalData.value['first-name'] !== undefined && addAuthorModalData.value['first-name'] !== '',
            'last-name': addAuthorModalData.value['last-name'] !== undefined && addAuthorModalData.value['last-name'] !== '',
            'country': addAuthorModalData.value['country'] !== undefined && addAuthorModalData.value['country'] !== '',
            'phone_type': addAuthorModalData.value['phone_type'] !== undefined && addAuthorModalData.value['phone_type'].length !== 0,
            'country_phone': addAuthorModalData.value['country_phone'] !== undefined && addAuthorModalData.value['country_phone'].length !== 0,
            'phone_number': addAuthorModalData.value['phone_number'] !== undefined && addAuthorModalData.value['phone_number'].length !== 0,
            'affiliations': addAuthorModalData.value['affiliations'] !== undefined && addAuthorModalData.value['affiliations'].length !== 0,
            'correspond_affiliation': addAuthorModalData.value['is_corresponding'] === undefined 
                || ( 
                    addAuthorModalData.value['is_corresponding'] === 'on' 
                    && ( addAuthorModalData.value['correspond_affiliation'] !== undefined && addAuthorModalData.value['correspond_affiliation'] !== '' ) 
                )
        }));
        const foundCountry = addAuthorModalData.countriesList.find( ( item: any ) => item.id === parseInt( addAuthorModalData.value['country'] ) );
        const foundPhoneType = phoneTypes.find( ( item: any ) => item.value === addAuthorModalData.value['phone_type']?.[0] );
        const foundCountryPhone = addAuthorModalData.countriesPhoneList.find( ( item: any ) => item.id === parseInt( addAuthorModalData.value['country_phone']?.[0] ) );
        setAuthorCountryInputValue( foundCountry ? foundCountry : '' );
        setAuthorPhoneTypeInputValue( foundPhoneType ? foundPhoneType : '' );
        setAuthorPhoneCountryInputValue( foundCountryPhone ? foundCountryPhone : '' );
    }, [addAuthorModalData.value]);
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
        setAffiliations( updatedAffiliations );
        const affiliationValues = updatedAffiliations.map( ( item: any ) => item.value );
        dispatch( handleInputArray( { name: 'affiliations', value: updatedAffiliations[index].value !== '' ? affiliationValues : '' } ) );
    }

    return (
        <>
            <FormControl className="mb-3 required" error={ !isValid['email'] && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Email
                </FormLabel>
                <div className="d-flex align-items-center">
                    <Input
                        required
                        readOnly={ !addAuthorModalData.inputStatus.email }
                        variant="soft"
                        className="flex-fill"
                        name="authorEmail"
                        id="authorEmail"
                        placeholder="Author's Email"
                        defaultValue={ addAuthorModalData.value['email'] }
                        onChange={ event => {
                            setAuthorEmailInputValue( event.target.value ); 
                            dispatch( handleInput( { name: 'email', value: event.target.value } ) ) } 
                        }
                    />
                    <Button className="btn btn-primary ms-2" onClick={ () => dispatch( searchPeople( authorEmailInputValue ) ) }>
                        <i className="fa-duotone fa-search me-1"></i>
                        <span>Search</span>
                    </Button>
                </div>
                {
                    ( !isValid['email'] && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">You should enter the author email</FormHelperText> 
                }
            </FormControl>
            <FormControl className={`mb-3 required ${ !addAuthorModalData.inputStatus.firstName ? 'read-only' : '' }`} error={ !isValid['first-name'] && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    First Name
                </FormLabel>
                <Input
                    required
                    readOnly={ !addAuthorModalData.inputStatus.firstName }
                    variant="soft"
                    name="authorFirstName"
                    id="authorFirstName"
                    placeholder="First Name"
                    defaultValue={ addAuthorModalData.value['first-name'] }
                    onChange={ event => dispatch( handleInput( { name: 'first-name', value: event.target.value } ) ) }
                />
                {
                    ( !isValid['first-name'] && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">You should enter the author first name</FormHelperText> 
                }
            </FormControl>
            <FormControl className={`mb-3 ${ !addAuthorModalData.inputStatus.middleName ? 'read-only' : '' }`}>
                <FormLabel className="fw-bold mb-1">
                    Middle Name
                </FormLabel>
                <Input
                    required
                    readOnly={ !addAuthorModalData.inputStatus.middleName }
                    variant="soft"
                    name="authorMiddleName"
                    id="authorMiddleName"
                    placeholder="Middle Name"
                    defaultValue={ addAuthorModalData.value['middle-name'] }
                    onChange={ event => dispatch( handleInput( { name: 'middle-name', value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className={`mb-3 required ${ !addAuthorModalData.inputStatus.lastName ? 'read-only' : '' }`} error={ !isValid['last-name'] && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Last Name
                </FormLabel>
                <Input
                    required
                    readOnly={ !addAuthorModalData.inputStatus.lastName }
                    variant="soft"
                    name="authorLastName"
                    id="authorLastName"
                    placeholder="Last Name"
                    defaultValue={ addAuthorModalData.value['last-name'] }
                    onChange={ event => dispatch( handleInput( { name: 'last-name', value: event.target.value } ) ) }
                />
                {
                    ( !isValid['last-name'] && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">You should enter the author last name</FormHelperText> 
                }
            </FormControl>
            <FormControl className={`mb-3 ${ !addAuthorModalData.inputStatus.orcid ? 'read-only' : '' }`}>
                <FormLabel className="fw-bold mb-1">
                    Orcid
                </FormLabel>
                <Input
                    variant="soft"
                    readOnly={ !addAuthorModalData.inputStatus.orcid }
                    name="authorOrcId"
                    id="authorOrcId"
                    placeholder="Orcid"
                    defaultValue={ addAuthorModalData.value['orcid-id'] }
                    onChange={ event => dispatch( handleInput( { name: 'orcid-id', value: event.target.value.toString() } ) ) }
                />
            </FormControl>
            <FormControl className={`mb-3 required ${ !addAuthorModalData.inputStatus.country ? 'read-only' : '' }`} error={ !isValid['country'] && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Country
                </FormLabel>
                <Autocomplete
                    required
                    readOnly={ !addAuthorModalData.inputStatus.country }
                    variant="soft"     
                    id="authorCountry"
                    name="authorCountry"
                    options={ addAuthorModalData.countriesList }
                    value={ authorCountryInputValue }
                    onChange={ ( event, value ) => {
                        dispatch( handleInput( { name: 'country', value: value?.id || '' } ) ) }
                    }
                />
                {
                    ( !isValid['country'] && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">You should enter the author country</FormHelperText> 
                }
            </FormControl>
            <fieldset className="fieldset mb-4">
                <legend>Phones</legend>
                <div className="d-flex align-items-center">
                    <FormControl className={`pe-2 col-md-4 required ${ !addAuthorModalData.inputStatus.phoneType ? 'read-only' : '' }`} error={ !isValid['phone_type'] && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Type
                        </FormLabel>
                        <Autocomplete
                            required
                            readOnly={ !addAuthorModalData.inputStatus.phoneType }
                            variant="soft" 
                            id="authorPhoneType"
                            name="authorPhoneType"
                            options={ phoneTypes }
                            value={ authorPhoneTypeInputValue }
                            onChange={ ( event, value ) => 
                                {
                                    dispatch( handleInputAsArray( { name: 'phone_type', value: value?.value || '' } ) )
                                }
                            }
                        />
                    </FormControl>
                    <FormControl className={`pe-2 col-md-4 required ${ !addAuthorModalData.inputStatus.countryPhone ? 'read-only' : '' }`} error={ !isValid['country_phone'] && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Country
                        </FormLabel>
                        <Autocomplete
                            required
                            readOnly={ !addAuthorModalData.inputStatus.countryPhone }
                            variant="soft"     
                            id="authorPhoneCountry"
                            name="authorPhoneCountry"
                            options={ addAuthorModalData.countriesPhoneList }
                            value={ authorPhoneCountryInputValue }
                            onChange={ ( event, value ) => {
                                dispatch( handleInputAsArray( { name: 'country_phone', value: value?.id.toString() || '' } ) ) }
                            }
                        />
                    </FormControl>
                    <FormControl className={`col-md-4 required ${ !addAuthorModalData.inputStatus.phoneNumber ? 'read-only' : '' }`} error={ !isValid['phone_number'] && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Number
                        </FormLabel>
                        <Input
                            required
                            autoComplete="off"
                            readOnly={ !addAuthorModalData.inputStatus.phoneNumber }
                            variant="soft"
                            name="authorPhoneNumber"
                            id="authorPhoneNumber"
                            placeholder="Phone Number"
                            defaultValue={ addAuthorModalData.value['phone_number'] }
                            onChange={ event => dispatch( handleInputAsArray( { name: 'phone_number', value: parseInt( event.target.value ) } ) ) }
                        />
                    </FormControl>
                </div>
                {
                    ( ( !isValid['phone_type'] || !isValid['country_phone'] || !isValid['phone_number'] ) && !formIsValid )
                        && <FormHelperText className="fs-7 text-danger mt-1">You should complete phone informations</FormHelperText>
                }
            </fieldset>
            <fieldset className="fieldset mb-4">
                <legend>Affiliations</legend>
                {affiliations.map((affiliation, index) => (
                    <FormControl className="mb-3 required" key={affiliation.id} error={ index === 0 && !isValid['affiliations'] && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Affiliation { index !== 0 && (index + 1)}
                        </FormLabel>
                        <Input
                            required={ affiliation.required }
                            variant="soft"
                            name={`authorAffiliations_${index}`}
                            id={`authorAffiliations_${index}`}
                            placeholder="Author Affiliation(s)"
                            defaultValue={affiliation.value}
                            onChange={ event => handleAffiliationChange( event, index ) }
                        />
                        {
                            ( index === 0 && !isValid['affiliations'] && !formIsValid ) 
                                && <FormHelperText className="fs-7 text-danger mt-1">You should enter at least one affiliation</FormHelperText>
                        }
                    </FormControl>
                ))}
                <Button className="btn btn-primary btn-lg mb-4" onClick={() => repeatField()}>
                    Add Affiliation
                </Button>
            </fieldset>
            <FormControl className={`required mb-3 ${ addAuthorModalData?.value['is_corresponding'] !== 'on' && 'd-none' }`}
                error={ !isValid['correspond_affiliation'] && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Corresponding Affiliation
                </FormLabel>
                <Input
                    required={ addAuthorModalData?.value['is_corresponding'] === 'on' }
                    variant="soft"
                    name="authorCorrespondAffiliation"
                    id="authorCorrespondAffiliation"
                    placeholder="Corresponding Affiliation"
                    defaultValue={ addAuthorModalData.value['correspond_affiliation'] }
                    onChange={ event => dispatch( handleInput( { name: 'correspond_affiliation', value: event.target.value } ) ) }
                />
                {
                    ( !isValid['correspond_affiliation'] && !formIsValid ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should enter correspond affiliation</FormHelperText>
                }
            </FormControl>
            <FormControl className="mb-4">
                <Checkbox
                    required
                    readOnly={ !addAuthorModalData.inputStatus.isCorresponding }
                    label="This author is corresponding"
                    name="isCorresponding"
                    id="isCorrsponding"
                    checked={ addAuthorModalData.value['is_corresponding'] === 'on' || false }
                    onChange={ event => dispatch ( handleCheckbox( { name: 'is_corresponding', value: addAuthorModalData.value['is_corresponding'] } ) ) }
                />
            </FormControl>
        </>
    );
}

export default AddAuthorModal;