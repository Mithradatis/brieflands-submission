import useMessageHandler from '@/app/hooks/messages'
import ModalContent from '@/components/modal'
import ClassificationsManagement from '@components/modal/forms/classifications'
import { useState, useEffect, forwardRef, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faRemove } from '@fortawesome/pro-duotone-svg-icons'
import { useGetClassificationsQuery } from '@/app/services/steps/classifications'
import { type Reviewer } from '@/app/services/types/reviewers'
import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
    FormControl,
    FormLabel,
    FormHelperText,
    Stack,
    TextField,
    Typography
} from '@mui/material'

interface ChildComponentProps {
    setSelectedClassifications: (value: any) => Promise<boolean>;
}

const AddReviewerModal = forwardRef(
    (
        props: {
            isEditing: boolean,
            workflowId: string,
            modalFormData: Reviewer
        },
        ref
    ) => {
        const { messageHandler } = useMessageHandler();
        const childRef = useRef<ChildComponentProps>();
        const filter = createFilterOptions();
        const dispatch: any = useDispatch();
        const suggestOrOpposeList = [
            { id: 1, title: 'Suggest Reviewer' },
            { id: 2, title: 'Oppose Reviewer' }
        ];
        const academicDegreeList = [
            { id: 0, title: 'Not Spcified' },
            { id: 1, title: 'B.Sc.' },
            { id: 2, title: 'M.Sc.' },
            { id: 3, title: 'MD' },
            { id: 4, title: 'PhD' },
            { id: 5, title: 'MD and PhD' },
            { id: 6, title: 'PharmD' },
            { id: 7, title: 'DDS' },
            { id: 8, title: 'Other' }
        ];
        const [formData, setFormData] = useState<Reviewer>({
            'email': '',
            'first-name': '',
            'middle-name': '',
            'last-name': '',
            'department': '',
            'reason': '',
            'university': '',
            'suggest-or-oppose': 0,
            'academic-degree': '',
            'classification': 0
        });
        const [nestedModalIsOpen, setNestedModalIsOpen] = useState<boolean>(false);
        const formIsValid = true;
        const [classifications, setClassifications]: any = useState([]);
        const [isValid, setIsValid] = useState<boolean>();
        const classificationsUrl = `${process.env.API_URL}/journal/classification`;
        const classificationsList: any = useGetClassificationsQuery(classificationsUrl);
        const hanldeNestedModalClose = () => {
            setNestedModalIsOpen(false);
        }
        const setSelectedClassifications = (value: any) => {
            childRef.current?.setSelectedClassifications(value);
        }
        useEffect(() => {
            setClassifications(classificationsList);
            // dispatch( getClassificationsList( classificationsUrl ) );
            // const isValidKeys = Object.keys(isValid);
            const suggestedOrOpposed: any = suggestOrOpposeList.find(
                (item: any) =>
                    item.id === formData['suggest-or-oppose']
            )?.title;
            const academicDegree: any = academicDegreeList.find(
                (item: any) =>
                    item.id === parseInt(formData['academic-degree'])
            )?.title;
            const selectedClassificationIds: any[] = [];
            const classifications: any[] = selectedClassificationIds?.map((classificationId: string) => {
                return classifications.find((item: any) => item.id === classificationId).id;
            });
            setClassifications(classifications ? classifications : []);
        }, []);
        useMemo(() => {
            if (props.modalFormData.email !== '') {
                setFormData(props.modalFormData);
            }
        }, [props.modalFormData]);

        return (
            <>
                <ClassificationsManagement
                    isOpen={nestedModalIsOpen}
                    handleClose={hanldeNestedModalClose}
                />
                <FormControl
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Suggest or Oppose
                        </Typography>
                    </FormLabel>
                    <Autocomplete
                        size="small"
                        disableClearable
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                placeholder="Choose one…"
                            />
                        )}
                        options={
                            Array.isArray(suggestOrOpposeList)
                                ? suggestOrOpposeList.map(
                                    (item: any) => {
                                        return item.title || ''
                                    }
                                ) : []
                        }
                        value={
                            suggestOrOpposeList.find(
                                (item: any) => item.id === formData['suggest-or-oppose']
                            )?.title
                        }
                        onChange={(event, value) => {
                            setFormData(
                                (prevState: any) => (
                                    {
                                        ...prevState,
                                        'suggest-or-oppose': suggestOrOpposeList.find(
                                            (item: any) => item.title === value
                                        )?.id || ''
                                    }
                                )
                            )
                        }}
                    />
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={
                        formData.email === '' &&
                        !formIsValid
                    }
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Email
                        </Typography>
                    </FormLabel>
                    <TextField
                        required
                        variant="filled"
                        size="small"
                        placeholder="Reviewer's Email"
                        defaultValue={formData.email}
                        onChange={
                            event => setFormData(
                                (prevState: any) => (
                                    {
                                        ...prevState,
                                        'email': event.target.value
                                    }
                                )
                            )
                        }
                    />
                    {
                        (
                            formData.email === '' &&
                            !formIsValid
                        ) &&
                        <FormHelperText>
                            <Typography variant="body-sm" color="error">
                                Please enter reviewer email
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={
                        formData['first-name'] === '' &&
                        !formIsValid
                    }
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            First Name
                        </Typography>
                    </FormLabel>
                    <TextField
                        required
                        variant="filled"
                        size="small"
                        placeholder="Reviewer's First Name"
                        defaultValue={formData['first-name']}
                        onChange={
                            event =>
                                setFormData(
                                    (prevState: any) => (
                                        {
                                            ...prevState,
                                            'first-name': event.target.value
                                        }
                                    )
                                )
                        }
                    />
                    {
                        (
                            formData['first-name'] === '' && !formIsValid
                        ) &&
                        <FormHelperText>
                            <Typography variant="body-sm" color="error">
                                Please enter reviewer first name
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Middle Name
                        </Typography>
                    </FormLabel>
                    <TextField
                        variant="filled"
                        size="small"
                        placeholder="Reviewer's Middle Name"
                        defaultValue={formData['middle-name']}
                        onChange={
                            event =>
                                setFormData(
                                    (prevState: any) => (
                                        {
                                            ...prevState,
                                            'middle-name': event.target.value
                                        }
                                    )
                                )
                        }
                    />
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={
                        formData['last-name'] === '' &&
                        !formIsValid
                    }
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Last Name
                        </Typography>
                    </FormLabel>
                    <TextField
                        required
                        variant="filled"
                        size="small"
                        placeholder="Reviewer's Last Name"
                        defaultValue={formData['last-name']}
                        onChange={
                            event =>
                                setFormData(
                                    (prevState: any) => (
                                        {
                                            ...prevState,
                                            'last-name': event.target.value
                                        }
                                    )
                                )
                        }
                    />
                    {
                        (
                            formData['last-name'] === '' &&
                            !formIsValid
                        ) &&
                        <FormHelperText>
                            <Typography variant="body-sm" color="error">
                                Please enter reviewer last name
                            </Typography>
                        </FormHelperText>
                    }
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Academic Degree
                        </Typography>
                    </FormLabel>
                    <Autocomplete
                        size="small"
                        disableClearable
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                placeholder="Choose one…"
                            />
                        )}
                        options={
                            Array.isArray(academicDegreeList)
                                ? academicDegreeList.map(
                                    (item: any) => {
                                        return item.title || ''
                                    }
                                ) : []
                        }
                        value={formData['academic-degree']}
                        onChange={(event, value) => {
                            setFormData(
                                (prevState: any) => (
                                    {
                                        ...prevState,
                                        'academic-degree': academicDegreeList.find(
                                            (item: any) => item.title === value
                                        )?.title || ''
                                    }
                                )
                            )
                        }}
                    />
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Department
                        </Typography>
                    </FormLabel>
                    <TextField
                        variant="filled"
                        size="small"
                        placeholder="Reviewer's Department"
                        defaultValue={formData['department']}
                        onChange={
                            event =>
                                setFormData(
                                    (prevState: any) => (
                                        {
                                            ...prevState,
                                            'department': event.target.value
                                        }
                                    )
                                )
                        }
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel>
                        <Typography variant="title-sm">
                            University
                        </Typography>
                    </FormLabel>
                    <TextField
                        variant="filled"
                        size="small"
                        placeholder="Reviewer's University"
                        defaultValue={formData['university']}
                        onChange={
                            event =>
                                setFormData(
                                    (prevState: any) => (
                                        {
                                            ...prevState,
                                            'university': event.target.value
                                        }
                                    )
                                )
                        }
                    />
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Type Classifications
                        </Typography>
                    </FormLabel>
                    <Stack
                        direction="row"
                        alignItems="center"
                    >
                        <Autocomplete
                            multiple
                            size="small"
                            sx={{ flex: 1, mr: 1 }}
                            disableClearable
                            onInputChange={() => { }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    placeholder="Classification Name…"
                                />
                            )}
                            options={
                                Array.isArray(classifications)
                                    ? classifications.map(
                                        (item: any) => {
                                            return item.attributes?.title || ''
                                        }
                                    ) : []
                            }
                            value={
                                Array.isArray(classifications)
                                    ? classifications
                                        .filter((item: any) => classifications.includes(item.id))
                                        .map((item: any) => item.attributes.title)
                                    : []
                            }
                            onChange={(event, value: any) => {
                                if (classifications && classifications.length > 0) {
                                    const selectedIds = value.map((selectedItem: any) => {
                                        const selectedOption = classifications.find(
                                            (item: any) => item.attributes.title === selectedItem
                                        );
                                        return selectedOption ? selectedOption.id : '';
                                    });
                                    setFormData(
                                        (prevState: any) => (
                                            {
                                                ...prevState,
                                                'classifications': selectedIds
                                            }
                                        )
                                    )
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option);
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push('Nothing found');
                                }

                                return filtered.filter((option: any) => {
                                    return option !== 'Nothing found' || isExisting;
                                });
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mb: 1 }}
                            onClick={() => setNestedModalIsOpen(true)}
                        >
                            Add
                        </Button>
                    </Stack>
                </FormControl>
                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <FormLabel>
                        <Typography variant="title-sm">
                            Reason
                        </Typography>
                    </FormLabel>
                    <TextField
                        multiline
                        variant="filled"
                        size="small"
                        minRows={3}
                        aria-label="textarea"
                        placeholder="Describe your Reason..."
                        value={formData['reason']}
                        onChange={
                            event =>
                                setFormData(
                                    (prevState: any) => (
                                        {
                                            ...prevState,
                                            'reason': event.target.value
                                        }
                                    )
                                )
                        }
                    />
                </FormControl>
            </>
        );
    });

AddReviewerModal.displayName = 'AddReviewerModal';

export default AddReviewerModal;