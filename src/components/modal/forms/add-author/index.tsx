import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch } from '@/store/store'
import { useGetCountriesQuery } from '@/app/services/apiSlice'
import { useLazySearchPeopleQuery, useHandleAuthorOperationMutation } from '@/app/services/steps/authors'
import { InputStatus } from '@/app/services/types/author'
import { handleModalSnackbarOpen } from '@/lib/features/snackbar/modalSnackbarSlice'
import { Author } from '@/app/services/types/author'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faAdd } from '@fortawesome/pro-duotone-svg-icons'
import useMessageHandler from '@/app/services/messages'
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    FormHelperText,
    Stack,
    Typography,
    TextField
} from '@mui/material'

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
        const [formData, setFormData] = useState<Author>({
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
        const [formIsValid, setFormIsValid] = useState<boolean>(true);
        const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
        const [inputStatus, setInputStatus] = useState<InputStatus>({
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
        const [authorEmailInputValue, setAuthorEmailInputValue] = useState<string>('');
        const [authorCountryInputValue, setAuthorCountryInputValue] = useState<any>(null);
        const [authorPhoneTypeInputValue, setAuthorPhoneTypeInputValue] = useState<any>(null);
        const [authorPhoneCountryInputValue, setAuthorPhoneCountryInputValue] = useState<any>(null);
        const [countries, setCountries] = useState<object[]>([]);
        const [phoneState, setPhoneState] = useState({
            phoneType: '',
            countryPhone: '',
            phoneNumber: ''
        });
        const [affiliations, setAffiliations] = useState(() => {
            const affiliationsInput: any = [];
            if (formData['affiliations']?.length > 0) {
                formData['affiliations'].map((affiliation: any, index: number) => {
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
        } = useGetCountriesQuery(getAllCountriesUrl);
        const [handleAuthorOperationTrigger] = useHandleAuthorOperationMutation();
        const [searchPeopleTrigger] = useLazySearchPeopleQuery();
        useEffect(() => {
            if (countries?.length > 0 && props.modalFormData.email !== '') {
                setFormData(props.modalFormData);
                const country = countries.find(
                    (item: any) => item.id === parseInt(props.modalFormData.country)
                );
                const phoneType = phoneTypes.find(
                    (item: any) => item.value === props.modalFormData.phoneType
                );
                const countryPhone = countries.find(
                    (item: any) => item.id === parseInt(props.modalFormData.countryPhone)
                );
                setAuthorCountryInputValue((prevState: any) => country || prevState);
                setAuthorPhoneTypeInputValue((prevState: any) => phoneType || prevState);
                setAuthorPhoneCountryInputValue((prevState: any) => countryPhone || prevState);
                setPhoneState({
                    phoneType: props.modalFormData.phoneType,
                    countryPhone: props.modalFormData.countryPhone,
                    phoneNumber: props.modalFormData.phoneNumber
                });
                setAffiliations(
                    () => {
                        const affiliationsInput: any = [];
                        if (props.modalFormData.affiliations?.length > 0) {
                            props.modalFormData.affiliations.map((affiliation: any, index: number) => {
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
                setInputStatus((prevState: any) => ({
                    ...prevState,
                    email: false
                }));
            }
        }, [props.modalFormData, countries]);
        useEffect(() => {
            if (allCountriesList) {
                const countriesList: any = [];
                allCountriesList.forEach((country: { id: string, attributes: { title: string } }) => {
                    countriesList.push({ id: parseInt(country.id), label: country.attributes.title });
                });
                setCountries(countriesList);
            }
        }, [allCountriesList]);
        useImperativeHandle(ref, () => ({
            resetForm() {
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
            async handleAuthorOperation() {
                if (
                    formData?.email !== ''
                    && formData?.firstName !== ''
                    && formData?.lastName !== ''
                    && formData?.phoneType !== ''
                    && formData?.countryPhone !== ''
                    && formData?.phoneNumber !== ''
                    && formData?.affiliations.length > 0
                    && (
                        (formData?.isCorresponding === 'off') ||
                        (
                            formData?.isCorresponding === 'on'
                            && formData?.correspondAffiliation !== ''
                        )
                    )
                ) {
                    setFormIsValid(true);
                    try {
                        const response = await handleAuthorOperationTrigger(
                            {
                                workflowId: props.workflowId,
                                action: props.isEditing ? 'edit' : 'add',
                                data: formData
                            }
                        );
                        if (response.error) {
                            messageHandler(
                                response,
                                {
                                    errorMessage: `Failed to ${props.isEditing ? 'edit' : 'add'} author`,
                                    successMessage: `author ${props.isEditing ? 'edited' : 'added'} successfuly`
                                },
                                true
                            );

                            return false;
                        } else {
                            messageHandler(
                                response,
                                {
                                    errorMessage: `Failed to ${props.isEditing ? 'edit' : 'add'} author`,
                                    successMessage: `author ${props.isEditing ? 'edited' : 'added'} successfuly`
                                },
                                false
                            );
                            return true;
                        }
                    } catch (error) {
                        console.error('Error in addAuthor:', error);

                        return false;
                    }
                } else {
                    setFormIsValid(false);
                    dispatch(handleModalSnackbarOpen(
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
        const handleFormInput = (inputName: string, value: string) => {
            setFormData((prevState: any) => ({
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
        const handleAffiliationChange = (event: any, index: any) => {
            const updatedAffiliations = [...affiliations];
            updatedAffiliations[index].value = event.target.value;
            setAffiliations(updatedAffiliations);
            const affiliationValues = updatedAffiliations.map(
                (item: any) => Array.isArray(item.value)
                    ? item.value[0]
                    : item.value
            );
            setFormData((prevState: any) => ({
                ...prevState,
                'affiliations': affiliationValues
            }));
        }
        const handleSearchPeople = async (authorEmailInputValue: string) => {
            if (authorEmailInputValue !== '') {
                const response = await searchPeopleTrigger(
                    {
                        workflowId: props.workflowId,
                        email: authorEmailInputValue
                    }
                );
                const foundedAuthor = response.data || [];
                if (
                    !Array.isArray(foundedAuthor) &&
                    Object.keys(foundedAuthor).length > 0
                ) {
                    setFormData((prevState: any) => (
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
                        (item: any) => item.id === parseInt(foundedAuthor.country)
                    );
                    const foundPhoneType = phoneTypes.find(
                        (item: any) => item.value === foundedAuthor.phones?.type
                    );
                    const foundCountryPhone = countries.find(
                        (item: any) => item.id === parseInt(foundedAuthor.phones?.country_phone)
                    );
                    setAuthorCountryInputValue((prevState: any) => foundCountry || prevState);
                    setAuthorPhoneTypeInputValue((prevState: any) => foundPhoneType || prevState);
                    setAuthorPhoneCountryInputValue((prevState: any) => foundCountryPhone || prevState);
                    setPhoneState({
                        phoneType: foundedAuthor.phones.type,
                        countryPhone: foundedAuthor.phones?.country_phone,
                        phoneNumber: foundedAuthor.phones.number
                    });
                    setInputStatus((prevState: any) => ({
                        ...prevState,
                        email: false,
                        firstName: false,
                        middleName: false,
                        lastName: false,
                        isCorresponding: false
                    }));
                } else {
                    setInputStatus((prevState: any) => ({
                        ...prevState,
                        email: false,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        isCorresponding: true
                    }));
                }
            } else {
                setEmailIsValid(false);
            }
        }

        return (
            <Box component="form" autoComplete="off">
                <FormControl
                    required
                    fullWidth
                    sx={{ mb: 1 }}
                    error={
                        !emailIsValid ||
                        formData.email === '' &&
                        !formIsValid}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Email
                        </Typography>
                    </FormLabel>
                    <Stack direction="row" alignItems="center">
                        <TextField
                            required
                            sx={{ flex: 1 }}
                            autoComplete="off"
                            variant="filled"
                            placeholder="Author's Email"
                            defaultValue={formData['email']}
                            onChange={event => {
                                setAuthorEmailInputValue(event.target.value);
                                handleFormInput('email', event.target.value);
                                setEmailIsValid(event.target.value !== '');
                            }}
                            InputProps={{
                                readOnly: !inputStatus.email,
                                autoComplete: 'off'
                            }}
                        />
                        {
                            !props.isEditing &&
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ ml: 1 }}
                                onClick={() => handleSearchPeople(authorEmailInputValue)}>
                                <FontAwesomeIcon icon={faSearch} />
                                <Typography component="span" pl={1}>
                                    Search
                                </Typography>
                            </Button>
                        }
                    </Stack>
                    {
                        (!emailIsValid || formData.email === '' && !formIsValid)
                        &&
                        <FormHelperText>
                            <Typography color="error" variant="body-xs">
                                You should enter the author email
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    required
                    fullWidth
                    disabled={!inputStatus.firstName}
                    sx={{ mb: 1 }}
                    error={formData.firstName === '' && !formIsValid}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            First Name
                        </Typography>
                    </FormLabel>
                    <TextField
                        required
                        variant="filled"
                        placeholder="First Name"
                        defaultValue={formData.firstName}
                        onChange={
                            event => handleFormInput('firstName', event.target.value)
                        }
                        InputProps={{
                            readOnly: !inputStatus.firstName,
                        }}
                    />
                    {
                        (formData.firstName === '' && !formIsValid)
                        &&
                        <FormHelperText>
                            <Typography color="error" variant="body-xs">
                                You should enter the author first name
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 1 }}
                    disabled={!inputStatus.middleName}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Middle Name
                        </Typography>
                    </FormLabel>
                    <TextField
                        required
                        variant="filled"
                        placeholder="Middle Name"
                        defaultValue={formData.middleName}
                        onChange={
                            event => handleFormInput('middleName', event.target.value)
                        }
                        InputProps={{
                            readOnly: !inputStatus.middleName,
                        }}
                    />
                </FormControl>
                <FormControl
                    required
                    fullWidth
                    sx={{ mb: 1 }}
                    disabled={!inputStatus.lastName}
                    error={formData.lastName === '' && !formIsValid}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Last Name
                        </Typography>
                    </FormLabel>
                    <TextField
                        required
                        variant="filled"
                        placeholder="Last Name"
                        defaultValue={formData.lastName}
                        onChange={
                            event => handleFormInput('lastName', event.target.value)
                        }
                        InputProps={{
                            readOnly: !inputStatus.lastName,
                        }}
                    />
                    {
                        (formData.lastName === '' && !formIsValid)
                        &&
                        <FormHelperText>
                            <Typography color="error" variant="body-xs">
                                You should enter the author last name
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 1 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Orcid
                        </Typography>
                    </FormLabel>
                    <TextField
                        variant="filled"
                        placeholder="Orcid"
                        defaultValue={formData.orcId}
                        onChange={
                            event => handleFormInput('orcId', event.target.value.toString())
                        }
                    />
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 1 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Country
                        </Typography>
                    </FormLabel>
                    <Autocomplete
                        loading={allCountriesIsLoading}
                        options={countries}
                        value={authorCountryInputValue}
                        autoComplete={false}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                autoComplete="off"
                            />
                        )}
                        onChange={(event, value) => {
                            const country = countries.find(
                                (item: any) => item.id === parseInt(value?.id)
                            );
                            setAuthorCountryInputValue((prevState: any) => country || null);
                            handleFormInput(
                                'country',
                                value?.id || 0
                            )
                        }}
                    />
                </FormControl>
                <Box component="fieldset" mb={1}>
                    <Typography component="legend">
                        Phones
                    </Typography>
                    <Stack
                        direction={
                            {
                                xs: 'column', md: 'row'
                            }
                        }
                        alignItems={
                            {
                                xs: '',
                                md: 'center'
                            }
                        }
                    >
                        <FormControl
                            required
                            fullWidth
                            sx={{ mb: 1, pr: 1, width: { xs: 'auto', md: 140 } }}
                            error={phoneState.phoneType === '' && !formIsValid}>
                            <FormLabel>
                                <Typography variant="title-sm">
                                    Type
                                </Typography>
                            </FormLabel>
                            <Autocomplete
                                options={phoneTypes}
                                value={authorPhoneTypeInputValue}
                                autoComplete={false}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        autoComplete="off"
                                    />
                                )}
                                onChange={
                                    (event: any, value: any) => {
                                        const phoneType = phoneTypes.find(
                                            (item: any) => item.id === value?.id
                                        );
                                        setAuthorPhoneTypeInputValue((prevState: any) => phoneType || null);
                                        setPhoneState({ ...phoneState, phoneType: value || '' });
                                        handleFormInput(
                                            'phoneType',
                                            value?.value || ''
                                        )
                                    }
                                }
                            />
                        </FormControl>
                        <FormControl
                            required
                            fullWidth
                            sx={{ mb: 1, pr: 1, width: { xs: 'auto', md: 140 } }}
                            error={phoneState.countryPhone === '' && !formIsValid}>
                            <FormLabel>
                                <Typography variant="title-sm">
                                    Country
                                </Typography>
                            </FormLabel>
                            <Autocomplete
                                options={countries}
                                value={authorPhoneCountryInputValue}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        autoComplete="off"
                                    />
                                )}
                                onChange={
                                    (event: any, value: any) => {
                                        const countryPhone = countries.find(
                                            (item: any) => item.id === parseInt(value?.id)
                                        );
                                        setAuthorPhoneCountryInputValue((prevState: any) => countryPhone || null);
                                        setPhoneState({ ...phoneState, countryPhone: value || '' });
                                        handleFormInput(
                                            'countryPhone',
                                            value?.id.toString() || ''
                                        )
                                    }
                                }
                            />
                        </FormControl>
                        <FormControl
                            required
                            fullWidth
                            sx={{ mb: 1, width: { xs: 'auto', md: 170 } }}
                            error={phoneState.phoneNumber === '' && !formIsValid}>
                            <FormLabel>
                                <Typography variant="title-sm">
                                    Number
                                </Typography>
                            </FormLabel>
                            <TextField
                                required
                                autoComplete="off"
                                variant="filled"
                                placeholder="Phone Number"
                                defaultValue={formData.phoneNumber}
                                onChange={
                                    (event: any) => {
                                        setPhoneState({ ...phoneState, phoneNumber: event.target.value || '' });
                                        handleFormInput(
                                            'phoneNumber',
                                            event.target.value
                                        )
                                    }
                                }
                            />
                        </FormControl>
                    </Stack>
                    {
                        (
                            !formIsValid &&
                            (
                                phoneState.phoneType === '' ||
                                phoneState.countryPhone === '' ||
                                phoneState.phoneNumber === ''
                            )
                        )
                        &&
                        <FormHelperText>
                            <Typography color="error" variant="body-xs">
                                Please fill all empty fields
                            </Typography>
                        </FormHelperText>
                    }
                </Box>
                <Box component="fieldset" mb={1}>
                    <legend>Affiliations</legend>
                    {affiliations.map((affiliation: any, index: number) => (
                        <FormControl
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                            key={affiliation.id}
                            error={
                                index === 0 &&
                                formData.affiliations.length === 0 &&
                                !formIsValid
                            }
                        >
                            <FormLabel sx={{ fontWeight: 700 }}>
                                <Typography variant="title-sm">
                                    Affiliation {index !== 0 && (index + 1)}
                                </Typography>
                            </FormLabel>
                            <TextField
                                required={affiliation.required}
                                variant="filled"
                                id={`authorAffiliations_${index}`}
                                placeholder="Author Affiliation(s)"
                                defaultValue={affiliation.value}
                                onChange={event => handleAffiliationChange(event, index)}
                            />
                            {
                                (index === 0 && formData.affiliations.length === 0 && !formIsValid)
                                &&
                                <FormHelperText>
                                    <Typography color="error" variant="body-xs">
                                        You should enter at least one affiliation
                                    </Typography>
                                </FormHelperText>
                            }
                        </FormControl>
                    ))}
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => repeatField()}>
                        <FontAwesomeIcon icon={faAdd} />
                        <Typography component="span" pl={1}>
                            Add Affiliation
                        </Typography>
                    </Button>
                </Box>
                <FormControl
                    required
                    fullWidth
                    sx={{ mb: 1, display: formData.isCorresponding !== 'on' ? 'none' : '' }}
                    error={
                        formData.isCorresponding === 'on' &&
                        formData.correspondAffiliation === '' &&
                        !formIsValid
                    }
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Corresponding Affiliation
                        </Typography>
                    </FormLabel>
                    <TextField
                        required={formData.isCorresponding === 'on'}
                        variant="filled"
                        placeholder="Corresponding Affiliation"
                        defaultValue={formData.correspondAffiliation}
                        onChange={event =>
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
                        <FormHelperText>
                            <Typography color="error" variant="body-xs">
                                You should enter correspond affiliation
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 1 }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                readOnly={!inputStatus.isCorresponding}
                                checked={formData.isCorresponding === 'on' || false}
                                onChange={
                                    event =>
                                        handleFormInput(
                                            'isCorresponding',
                                            formData.isCorresponding === 'on' ? 'off' : 'on'
                                        )
                                }
                            />
                        }
                        label={
                            <Typography fontSize={14}>
                                This author is corresponding
                            </Typography>
                        }
                    />
                </FormControl >
            </Box>
        );
    });

AddAuthorModal.displayName = 'AddAuthorModal';

export default AddAuthorModal;