import Button from '@mui/material/Button'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch } from '@/app/store'
import { useGetCountriesQuery } from '@/app/services/apiSlice'
import { useLazySearchPeopleQuery, useHandleAuthorOperationMutation } from '@/app/services/steps/authors'
import { InputStatus } from '@/app/services/types/author'
import { handleModalSnackbarOpen } from '@/lib/features/snackbar/modalSnackbarSlice'
import { Author } from '@/app/services/types/author'
import useMessageHandler from '@/app/services/messages'
import { 
    Autocomplete, 
    Checkbox, 
    Input, 
    FormControl, 
    FormLabel, 
    FormHelperText, 
    CircularProgress 
} from '@mui/joy'

const AddAuthorModal = forwardRef( 
    ( 
        props: { 
            isEditing: boolean, 
            workflowId: string, 
            modalFormData: Author 
        }, 
        ref 
    ) => {
    const { messageHandler } = useMessageHandler();    
    const dispatch: any = useAppDispatch();
    const [ formData, setFormData ] = useState<Author>({
        email: '',
        firstName: '',
        middleName: '',
        lastName: '',
        orcId: '',
        country: '',
        phoneType: '',
        countryPhone: '',
        phoneNumber: '',
        affiliations: [],
        isCorresponding: 'off',
        correspondAffiliation: ''
    });
    const [ formIsValid, setFormIsValid ] = useState<boolean>( true );
    const [ emailIsValid, setEmailIsValid ] = useState<boolean>( true );
    const [ inputStatus, setInputStatus ] = useState<InputStatus>({
        email: true,
        firstName: false,
        middleName: false,
        lastName: false,
        isCorresponding: false
    });
    const phoneTypes = [
        { id: 1, label: 'Mobile', value: 'mobile' },
        { id: 2, label: 'Home', value: 'home' },
        { id: 3, label: 'Work', value: 'work' },
        { id: 4, label: 'Fax', value: 'fax' }
    ];
    const [ authorEmailInputValue, setAuthorEmailInputValue ] = useState<string>('');
    const [ authorCountryInputValue, setAuthorCountryInputValue ] = useState<any>(null);
    const [ authorPhoneTypeInputValue, setAuthorPhoneTypeInputValue ] = useState<any>(null);
    const [ authorPhoneCountryInputValue, setAuthorPhoneCountryInputValue ] = useState<any>(null);
    const [ countries, setCountries ] = useState<object[]>([]);
    const [ phoneState, setPhoneState ] = useState({
        phoneType: '',
        countryPhone: '',
        phoneNumber: ''
    });
    const [ affiliations, setAffiliations ] = useState( () => {
        const affiliationsInput: any = [];
        if ( formData['affiliations']?.length > 0 ) {
            formData['affiliations'].map( ( affiliation: any, index: number ) => {
                affiliationsInput.push({
                    id: index + 1,
                    value: affiliation,
                    required: index === 0
                });
            });
        } else {
            affiliationsInput.push({
                id: 1,
                value: '',
                required: true
            });
        }
        
        return affiliationsInput;
    });
    const getAllCountriesUrl = 'journal/country?page[size]=1000';
    const { 
        data: allCountriesList, 
        isLoading: allCountriesIsLoading 
    } = useGetCountriesQuery( getAllCountriesUrl );
    const [ handleAuthorOperationTrigger ] = useHandleAuthorOperationMutation();
    const [ searchPeopleTrigger ] = useLazySearchPeopleQuery();
    useEffect(() => {
        if ( countries?.length > 0 && props.modalFormData.email !== '' ) {
            setFormData( props.modalFormData );
            const country = countries.find( 
                ( item: any ) => item.id === parseInt( props.modalFormData.country ) 
            );
            const phoneType = phoneTypes.find( 
                ( item: any ) => item.value === props.modalFormData.phoneType 
            );
            const countryPhone = countries.find( 
                ( item: any ) => item.id === parseInt( props.modalFormData.countryPhone ) 
            );
            setAuthorCountryInputValue( ( prevState: any ) => country || prevState );
            setAuthorPhoneTypeInputValue( ( prevState: any ) => phoneType || prevState );
            setAuthorPhoneCountryInputValue( ( prevState: any ) => countryPhone || prevState );
            setPhoneState({
                phoneType: props.modalFormData.phoneType,
                countryPhone: props.modalFormData.countryPhone,
                phoneNumber: props.modalFormData.phoneNumber
            });
            setAffiliations(
                () => {
                    const affiliationsInput: any = [];
                    if ( props.modalFormData.affiliations?.length > 0 ) {
                        props.modalFormData.affiliations.map( ( affiliation: any, index: number ) => {
                            affiliationsInput.push({
                                id: index + 1,
                                value: affiliation,
                                required: index === 0
                            });
                        });
                    } else {
                        affiliationsInput.push({
                            id: 1,
                            value: '',
                            required: true
                        });
                    }
                    
                    return affiliationsInput;
                }
            );
            setInputStatus( ( prevState: any ) => ({
                ...prevState,
                email: false
            }));
        }
    }, [props.modalFormData, countries]);
    useEffect(() => {
        if ( allCountriesList ) {
            const countriesList: any = [];
            allCountriesList.forEach( ( country: { id: string, attributes: { title: string } } ) => {
                countriesList.push({ id: parseInt( country.id ), label: country.attributes.title });
            });
            setCountries( countriesList );
        }
    }, [allCountriesList]);
    useImperativeHandle(ref, () => ({
        resetForm () {
            setFormData({
                email: '',
                firstName: '',
                middleName: '',
                lastName: '',
                orcId: '',
                country: '',
                phoneType: '',
                countryPhone: '',
                phoneNumber: '',
                affiliations: [],
                isCorresponding: '',
                correspondAffiliation: ''
            });
        },
        addAuthor () {
            if (
                formData?.email !== ''
                && formData?.firstName !== ''
                && formData?.lastName !== ''
                && formData?.phoneType !== ''
                && formData?.countryPhone !== ''
                && formData?.phoneNumber !== ''
                && formData?.affiliations.length > 0
                && (
                  ( formData?.isCorresponding === 'off' ) || 
                  (  
                    formData?.isCorresponding === 'on'
                    && formData?.correspondAffiliation !== ''
                  )
                )
            ) {
                setFormIsValid( true );
                try {
                    handleAuthorOperationTrigger( 
                        { 
                            workflowId: props.workflowId,
                            action: props.isEditing ? 'edit' : 'add',
                            data: formData 
                        }
                    ).then( ( response: any ) => {
                        if ( response.error ) {
                            messageHandler( 
                                response, 
                                { 
                                    errorMessage: `Failed to ${ props.isEditing ? 'edit' : 'add' } author`, 
                                    successMessage: `author ${ props.isEditing ? 'edited' : 'added' } successfuly` 
                                },
                                true
                            );

                            return false;
                        } else {
                            messageHandler( 
                                response, 
                                { 
                                    errorMessage: `Failed to ${ props.isEditing ? 'edit' : 'add' } author`, 
                                    successMessage: `author ${ props.isEditing ? 'edited' : 'added' } successfuly` 
                                },
                                false
                            );
                            return true;
                        }
                    });
                    
                    return true;
                } catch ( error ) {
                  console.error('Error in addAuthor:', error);
                  
                  return false;
                }
            } else {
                setFormIsValid( false );
                dispatch( handleModalSnackbarOpen( 
                    { 
                        severity: 'error', 
                        message: 'Please scroll down and check all invalid fields.', 
                        vertical: 'top', 
                        horizontal: 'center' 
                    } 
                ));
        
                return false;
            }
        }
    }));
    const handleFormInput = ( inputName: string, value: string ) => {
        setFormData( ( prevState: any ) => ({
            ...prevState,
            [inputName]: value
        })) 
    };
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
        const affiliationValues = updatedAffiliations.map( 
            ( item: any ) => Array.isArray( item.value ) 
                ? item.value[0] 
                : item.value 
        );
        handleFormInput(
            'affiliations', 
            updatedAffiliations[index].value !== '' 
                ? affiliationValues 
                : []
        );
    }
    const handleSearchPeople = ( authorEmailInputValue: string ) => {
        if ( authorEmailInputValue !== '' ) {
            searchPeopleTrigger( 
                { 
                    workflowId: props.workflowId, 
                    email: authorEmailInputValue 
                }
            ).then( ( response: any ) => {
                const foundedAuthor = response.data || []; 
                if (
                    !Array.isArray( foundedAuthor ) && 
                    Object.keys( foundedAuthor ).length > 0 
                ) {
                    setFormData( ( prevState: any ) => (
                        {
                            ...prevState,
                            email: authorEmailInputValue,
                            firstName: foundedAuthor.first_name,
                            middleName: foundedAuthor.middle_name,
                            lastName: foundedAuthor.last_name,
                            orcId: foundedAuthor.orcid_id,
                            country: foundedAuthor.country,
                            phoneType: foundedAuthor.phones.type,
                            countryPhone: foundedAuthor.phones.country_phone,
                            phoneNumber: foundedAuthor.phones.number
                        }
                    ));
                    const foundCountry = countries.find( 
                        ( item: any ) => item.id === parseInt( foundedAuthor.country ) 
                    );
                    const foundPhoneType = phoneTypes.find( 
                        ( item: any ) => item.value === foundedAuthor.phones?.type 
                    );
                    const foundCountryPhone = countries.find( 
                        ( item: any ) => item.id === parseInt( foundedAuthor.phones?.country_phone ) 
                    );
                    setAuthorCountryInputValue( ( prevState: any ) => foundCountry || prevState );
                    setAuthorPhoneTypeInputValue( ( prevState: any ) => foundPhoneType || prevState );
                    setAuthorPhoneCountryInputValue( ( prevState: any ) => foundCountryPhone || prevState );
                    setPhoneState({
                        phoneType: foundedAuthor.phones.type,
                        countryPhone: foundedAuthor.phones?.country_phone,
                        phoneNumber: foundedAuthor.phones.number
                    });
                    setInputStatus( ( prevState: any ) => ({
                        ...prevState,
                        email: false,
                        firstName: false,
                        middleName: false,
                        lastName: false,
                        isCorresponding: false
                    }));
                } else {
                    setInputStatus( ( prevState: any ) => ({
                        ...prevState,
                        email: false,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        isCorresponding: true
                    }));
                }
            });
        } else {
            setEmailIsValid( false );
        }
    }

    return (
        <>
            <FormControl 
                className="mb-3 required" 
                error={ 
                    !emailIsValid || 
                    formData.email === '' && 
                    !formIsValid }
                >
                <FormLabel className="fw-bold mb-1">
                    Email
                </FormLabel>
                <div className="d-flex align-items-center">
                    <Input
                        required
                        autoComplete="off"
                        readOnly={ !inputStatus.email }
                        variant="soft"
                        className="flex-fill"
                        name="authorEmail"
                        id="authorEmail"
                        placeholder="Author's Email"
                        defaultValue={ formData['email'] }
                        onChange={ event => {
                            setAuthorEmailInputValue( event.target.value ); 
                            handleFormInput( 'email', event.target.value );
                            setEmailIsValid( event.target.value !== '' );
                        }}
                    />
                    {
                        !props.isEditing &&
                            <Button 
                                className="btn btn-primary ms-2" 
                                onClick={ () => handleSearchPeople( authorEmailInputValue ) }>
                                <i className="fa-duotone fa-search me-1"></i>
                                <span>Search</span>
                            </Button>
                    }
                </div>
                {
                    ( !emailIsValid || formData.email === '' && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">
                            You should enter the author email
                        </FormHelperText> 
                }
            </FormControl>
            <FormControl className={`mb-3 required ${ 
                    !inputStatus.firstName 
                        ? 'read-only' 
                        : '' 
                }`} 
                error={ formData.firstName === '' && !formIsValid }
            >
                <FormLabel className="fw-bold mb-1">
                    First Name
                </FormLabel>
                <Input
                    required
                    readOnly={ !inputStatus.firstName }
                    variant="soft"
                    name="authorFirstName"
                    id="authorFirstName"
                    placeholder="First Name"
                    defaultValue={ formData.firstName }
                    onChange={ 
                        event => handleFormInput( 'firstName', event.target.value )
                    }
                />
                {
                    ( formData.firstName === '' && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">
                            You should enter the author first name
                        </FormHelperText> 
                }
            </FormControl>
            <FormControl className={`mb-3 ${ !inputStatus.middleName ? 'read-only' : '' }`}>
                <FormLabel className="fw-bold mb-1">
                    Middle Name
                </FormLabel>
                <Input
                    required
                    readOnly={ !inputStatus.middleName }
                    variant="soft"
                    name="authorMiddleName"
                    id="authorMiddleName"
                    placeholder="Middle Name"
                    defaultValue={ formData.middleName }
                    onChange={ 
                        event => handleFormInput( 'middleName', event.target.value ) 
                    }
                />
            </FormControl>
            <FormControl 
                className={`mb-3 required ${ 
                    !inputStatus.lastName 
                        ? 'read-only' 
                        : '' 
                }`} 
                error={ formData.lastName === '' && !formIsValid }
            >
                <FormLabel className="fw-bold mb-1">
                    Last Name
                </FormLabel>
                <Input
                    required
                    readOnly={ !inputStatus.lastName }
                    variant="soft"
                    name="authorLastName"
                    id="authorLastName"
                    placeholder="Last Name"
                    defaultValue={ formData.lastName }
                    onChange={ 
                        event => handleFormInput( 'lastName', event.target.value )
                    }
                />
                {
                    ( formData.lastName === '' && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">
                            You should enter the author last name
                        </FormHelperText> 
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
                    placeholder="Orcid"
                    defaultValue={ formData.orcId }
                    onChange={ 
                        event => handleFormInput( 'orcId', event.target.value.toString() )
                    }
                />
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Country
                </FormLabel>
                <Autocomplete
                    loading={ allCountriesIsLoading }
                    variant="soft"     
                    id="authorCountry"
                    name="authorCountry"
                    options={ countries }
                    value={ authorCountryInputValue }
                    onChange={ ( event, value ) => {
                        handleFormInput( 
                            'country', 
                            value?.id || ''
                        ) 
                    }}
                    slotProps={{
                        input: {
                        autoComplete: 'new-password',
                        },
                    }}
                    endDecorator={
                        allCountriesIsLoading ? (
                          <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                        ) : null
                    }
                />
            </FormControl>
            <fieldset className="fieldset mb-4">
                <legend>Phones</legend>
                <div className="d-flex align-items-center">
                    <FormControl 
                        className="pe-2 col-md-4 required" 
                        error={ phoneState.phoneType === '' && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Type
                        </FormLabel>
                        <Autocomplete
                            required
                            variant="soft" 
                            id="authorPhoneType"
                            name="authorPhoneType"
                            options={ phoneTypes }
                            value={ authorPhoneTypeInputValue }
                            onChange={ ( event: any, value: any ) => 
                                {
                                    setPhoneState( { ...phoneState, phoneType: value || '' } );
                                    handleFormInput( 
                                        'phoneType', 
                                        value?.value || ''
                                    )
                                }
                            }
                            slotProps={{
                                input: {
                                  autoComplete: 'new-password',
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl 
                        className="pe-2 col-md-4 required" 
                        error={ phoneState.countryPhone === '' && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Country
                        </FormLabel>
                        <Autocomplete
                            required
                            variant="soft"     
                            id="authorPhoneCountry"
                            name="authorPhoneCountry"
                            options={ countries }
                            value={ authorPhoneCountryInputValue }
                            onChange={ ( event: any, value: any ) => {
                                setPhoneState( { ...phoneState, countryPhone: value || '' } );
                                handleFormInput( 
                                    'countryPhone', 
                                    value?.id.toString() || ''
                                ) 
                            }}
                            slotProps={{
                                input: {
                                  autoComplete: 'new-password',
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl 
                        className="col-md-4 required" 
                        error={ phoneState.phoneNumber === '' && !formIsValid }>
                        <FormLabel className="fw-bold mb-1">
                            Number
                        </FormLabel>
                        <Input
                            required
                            autoComplete="off"
                            variant="soft"
                            name="authorPhoneNumber"
                            id="authorPhoneNumber"
                            placeholder="Phone Number"
                            defaultValue={ formData.phoneNumber }
                            onChange={ ( event: any ) => {
                                setPhoneState( { ...phoneState, phoneNumber: event.target.value || '' } );
                                handleFormInput( 
                                    'phoneNumber', 
                                    event.target.value 
                                ) 
                            }}
                        />
                    </FormControl>
                </div>
                {
                    ( 
                        !formIsValid && 
                        ( 
                            phoneState.phoneType === '' || 
                            phoneState.countryPhone === '' || 
                            phoneState.phoneNumber === '' 
                        ) 
                    ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">
                            Please fill all empty fields
                        </FormHelperText> 
                }
            </fieldset>
            <fieldset className="fieldset mb-4">
                <legend>Affiliations</legend>
                {affiliations.map( ( affiliation: any, index: number ) => (
                    <FormControl 
                        className="mb-3 required" 
                        key={affiliation.id} 
                        error={ 
                            index === 0 && 
                            formData.affiliations.length === 0 && 
                            !formIsValid 
                        }
                    >
                        <FormLabel className="fw-bold mb-1">
                            Affiliation { index !== 0 && (index + 1)}
                        </FormLabel>
                        <Input
                            required={ affiliation.required }
                            variant="soft"
                            name={`authorAffiliations_${index}`}
                            id={`authorAffiliations_${index}`}
                            placeholder="Author Affiliation(s)"
                            defaultValue={ affiliation.value }
                            onChange={ event => handleAffiliationChange( event, index ) }
                        />
                        {
                            ( index === 0 && formData.affiliations.length === 0  && !formIsValid ) 
                                && <FormHelperText className="fs-7 text-danger mt-1">
                                        You should enter at least one affiliation
                                    </FormHelperText>
                        }
                    </FormControl>
                ))}
                <Button 
                    className="btn btn-primary btn-lg mb-4" 
                    onClick={() => repeatField()}>
                    Add Affiliation
                </Button>
            </fieldset>
            <FormControl 
                className={`required mb-3 ${ 
                    formData.isCorresponding !== 'on' && 'd-none' 
                }`}
                error={ 
                    formData.isCorresponding === 'on' && 
                    formData.correspondAffiliation === '' && 
                    !formIsValid 
                }
            >
                <FormLabel className="fw-bold mb-1">
                    Corresponding Affiliation
                </FormLabel>
                <Input
                    required={ formData.isCorresponding === 'on' }
                    variant="soft"
                    name="authorCorrespondAffiliation"
                    id="authorCorrespondAffiliation"
                    placeholder="Corresponding Affiliation"
                    defaultValue={ formData.correspondAffiliation }
                    onChange={ event => 
                        handleFormInput( 
                            'correspondAffiliation', 
                            event.target.value 
                        ) 
                    }
                />
                {
                    ( 
                        formData.isCorresponding === 'on' && 
                        formData.correspondAffiliation === '' && 
                        !formIsValid 
                    ) && 
                        <FormHelperText className="fs-7 text-danger mt-1">
                            You should enter correspond affiliation
                        </FormHelperText>
                }
            </FormControl>
            <FormControl className="mb-4">
                <Checkbox
                    required
                    readOnly={ !inputStatus.isCorresponding }
                    label="This author is corresponding"
                    name="isCorresponding"
                    id="isCorrsponding"
                    checked={ formData.isCorresponding === 'on' || false }
                    onChange={ 
                        event => 
                            handleFormInput( 
                                'isCorresponding', 
                                formData.isCorresponding === 'on' ? 'off' : 'on'
                            ) 
                    }
                />
            </FormControl>
        </>
    );
});

export default AddAuthorModal;