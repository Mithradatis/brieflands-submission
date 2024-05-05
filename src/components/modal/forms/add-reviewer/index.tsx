import { useState, useEffect, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleNestedOpen, handleNestedClose } from '@features/modal/modalSlice'
import { handleInput, handleClassifications } from '@features/modal/addReviewerModalSlice'
import { Reviewer } from '@/app/services/types/reviewers'
import { Modal } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faRemove } from '@fortawesome/pro-duotone-svg-icons'
import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
    Divider,
    FormControl,
    FormLabel,
    FormHelperText,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from '@mui/material'

const AddReviewerModal = forwardRef(
    (
        props: {
            isEditing: boolean,
            workflowId: string,
            modalFormData: Reviewer
        },
        ref
    ) => {
    const filter = createFilterOptions();
    const dispatch: any = useDispatch();
    const wizard = useSelector((state: any) => state.wizard);
    const modalData = useSelector((state: any) => state.modal);
    const addReviewerFormData = useSelector((state: any) => state.addReviewerModal);
    const [selectedClassifications, setSelectedClassifications] = useState<{ classification: string }[]>([]);
    const [disabledClassifications, setDisabledClassifications] = useState<{ [key: string]: boolean }>({});
    const formIsValid = true;
    const [reviewerSuggestedOrOpposed, setReviewerSuggestedOrOpposed]: any = useState({});
    const [reviewerAcademicDegree, setReviewerAcademicDegree]: any = useState({});
    const [reviewerClassifications, setReviewerClassifications]: any = useState([]);
    const [isValid, setIsValid] = useState({
        reviewerEmail: modalData.modalFormData.reviewerEmail && modalData.modalFormData.reviewerEmail !== '',
        reviewerFirstName: modalData.modalFormData.reviewerFirstName && modalData.modalFormData.reviewerFirstName !== '',
        reviewerLastName: modalData.modalFormData.reviewerLastName && modalData.modalFormData.reviewerLastName !== '',
    });
    const selectClassification = (classification: any) => {
        setSelectedClassifications((prevClassifications) => [...prevClassifications, classification]);
        setDisabledClassifications((prevDisabledClassifications) => ({
            ...prevDisabledClassifications,
            [classification]: true,
        }));
    };
    const removeClassification = (index: any, classification: any) => {
        setSelectedClassifications((prevClassifications) => {
            const updatedClassifications = [...prevClassifications];
            updatedClassifications.splice(index, 1);
            return updatedClassifications;
        });
        setDisabledClassifications((prevDisabledClassifications) => ({
            ...prevDisabledClassifications,
            [classification]: false,
        }));
    };
    useEffect(() => {
        const classificationsUrl = `${process.env.API_URL}/journal/classification`;
        // dispatch( getClassificationsList( classificationsUrl ) );
        const isValidKeys = Object.keys(isValid);
        for (const [key, value] of Object.entries(modalData.modalFormData)) {
            if (isValidKeys.includes(key)) {
                if (value === '') {
                    setIsValid({ ...isValid, [key]: false });
                } else {
                    setIsValid({ ...isValid, [key]: true });
                }
            }
        }
        const suggestedOrOpposed: any = addReviewerFormData.suggestOrOpposeList.find(
            (item: any) =>
                item.id === parseInt(
                    addReviewerFormData.value['suggest-or-oppose'])
        )?.title;
        const academicDegree: any = addReviewerFormData.academicDegreeList.find(
            (item: any) =>
                item.id === parseInt(
                    addReviewerFormData.value['academic-degree'])
        )?.title;
        const selectedClassificationIds = addReviewerFormData.value['classifications'];
        const classifications: any[] = selectedClassificationIds?.map((classificationId: string) => {
            return addReviewerFormData.classificationsList.find((item: any) => item.id === classificationId).id;
        });
        setReviewerSuggestedOrOpposed(suggestedOrOpposed ? suggestedOrOpposed : '');
        setReviewerAcademicDegree(academicDegree ? academicDegree : '');
        setReviewerClassifications(classifications ? classifications : []);
    }, [addReviewerFormData.value]);


    return (
        <>
            <Modal
                open={modalData.nestedModalOpen}
                aria-labelledby="nested-modal-title"
                aria-describedby="nested-modal-description">
                <Box sx={{ width: 600 }}>
                    <Box className="modal-header block">
                        <Typography
                            variant="h2"
                            id="parent-modal-title"
                            className="fs-4 text-center text-green fw-bold container-fluid mb-4"
                        >
                            Classifications
                        </Typography>
                        <Divider className="container-fluid mb-4" />
                    </Box>
                    <Box className="modal-body">
                        <Scrollbars
                            className="mb-4"
                            style={{ width: 100 + '%', height: 300 }}
                            universal={true}
                            autoHide
                            autoHideTimeout={300}
                            autoHideDuration={300}>
                            <Stack direction="row" alignItems="center">
                                <Box className="border-end flex-fill pe-4">
                                    <Typography 
                                        variant="h5"
                                        color="muted" 
                                    >
                                        Available Classifications
                                    </Typography>
                                    <List>
                                        {
                                            addReviewerFormData.classificationsList?.map((item: any, index: number) => {
                                                return (
                                                    <ListItem 
                                                        className="mb-2 bg-light rounded" 
                                                        key={index}
                                                    >
                                                        <ListItemText>
                                                            {item.attributes.title}
                                                        </ListItemText>
                                                        <Button
                                                            size="small"
                                                            onClick={() => {
                                                                const selectedIds: any = [];
                                                                selectedIds.push(item.id);
                                                                selectClassification(item.attributes.title);
                                                                dispatch(
                                                                    handleInput(
                                                                        {
                                                                            name: 'classifications',
                                                                            value: selectedIds
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                            disabled={
                                                                disabledClassifications[item.attributes.title]
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faAngleRight} />
                                                        </Button>
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>
                                </Box>
                                <Box className="flex-fill ps-4">
                                    <Typography 
                                        variant="h5" 
                                        className="fs-7 fw-bold text-muted"
                                    >
                                        Selected Classifications
                                    </Typography>
                                    <List id="selected-classifications">
                                        {selectedClassifications.map((item: any, index: any) => (
                                            <ListItem className="mb-2 bg-light rounded" key={index}>
                                                <ListItemText>
                                                    {item}
                                                </ListItemText>
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => removeClassification(index, item)}
                                                >
                                                    <FontAwesomeIcon icon={faRemove} />
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Stack>
                        </Scrollbars>
                    </Box>
                    <Box className="modal-footer">
                        <Button className="button btn_primary"
                            onClick={() => {
                                dispatch(handleClassifications(selectedClassifications));
                                dispatch(handleNestedClose());
                            }
                            }>
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
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
                        Array.isArray(addReviewerFormData.suggestOrOpposeList)
                            ? addReviewerFormData.suggestOrOpposeList.map(
                                (item: any) => {
                                    return item.title || ''
                                }
                            ) : []
                    }
                    value={reviewerSuggestedOrOpposed}
                    onChange={(event, value) => {
                        dispatch(handleInput({
                            name: 'suggest-or-oppose',
                            value: addReviewerFormData.suggestOrOpposeList.find(
                                (item: any) => item.title === value)?.id || ''
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
                    !isValid.reviewerEmail && 
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
                    defaultValue={addReviewerFormData.value['email']}
                    onChange={
                        event => dispatch(
                            handleInput(
                                { 
                                    name: 'email', 
                                    value: event.target.value 
                                }
                            )
                        )
                    }
                />
                {
                    (
                        !isValid.reviewerEmail &&
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
                    !isValid.reviewerFirstName &&
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
                    defaultValue={addReviewerFormData.value['first-name']}
                    onChange={event => dispatch(handleInput({ name: 'first-name', value: event.target.value }))}
                />
                {
                    (!isValid.reviewerFirstName && !formIsValid)
                    && <FormHelperText className="fs-7 text-danger mt-1">Please enter reviewer first name</FormHelperText>
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
                    defaultValue={addReviewerFormData.value['middle-name']}
                    onChange={event => dispatch(handleInput({ name: 'middle-name', value: event.target.value }))}
                />
            </FormControl>
            <FormControl
                fullWidth
                sx={{ mb: 2 }}
                error={
                    !isValid.reviewerLastName &&
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
                    defaultValue={addReviewerFormData.value['last-name']}
                    onChange={event => dispatch(handleInput({ name: 'last-name', value: event.target.value }))}
                />
                {
                    (
                        !isValid.reviewerLastName &&
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
                        Array.isArray(addReviewerFormData.academicDegreeList)
                            ? addReviewerFormData.academicDegreeList.map(
                                (item: any) => {
                                    return item.title || ''
                                }
                            ) : []
                    }
                    value={reviewerAcademicDegree}
                    onChange={(event, value) => {
                        dispatch(handleInput({
                            name: 'academic-degree',
                            value: addReviewerFormData.academicDegreeList.find(
                                (item: any) => item.title === value)?.id || ''
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
                    defaultValue={addReviewerFormData.value['department']}
                    onChange={event => dispatch(handleInput({ name: 'department', value: event.target.value }))}
                />
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel>
                    <Typography variant="title-sm">
                        University
                    </Typography>
                </FormLabel>
                <TextField
                    variant="filled"
                    size="small"
                    placeholder="Reviewer's University"
                    defaultValue={addReviewerFormData.value['university']}
                    onChange={event => dispatch(handleInput({ name: 'university', value: event.target.value }))}
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
                <Stack direction="row" alignItems="center">
                    <Autocomplete
                        multiple
                        className="flex-fill"
                        size="small"
                        disableClearable
                        onInputChange={handleInput}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                placeholder="Classification Name…"
                            />
                        )}
                        options={
                            Array.isArray(addReviewerFormData.classificationsList)
                                ? addReviewerFormData.classificationsList.map(
                                    (item: any) => {
                                        return item.attributes?.title || ''
                                    }
                                ) : []
                        }
                        value={
                            Array.isArray(addReviewerFormData.classificationsList)
                                ? addReviewerFormData.classificationsList
                                    .filter((item: any) => reviewerClassifications.includes(item.id))
                                    .map((item: any) => item.attributes.title)
                                : []
                        }
                        onChange={(event, value: any) => {
                            const selectedIds = value.map((selectedItem: any) => {
                                const selectedOption = addReviewerFormData.classificationsList.find(
                                    (item: any) => item.attributes.title === selectedItem
                                );
                                return selectedOption ? selectedOption.id : '';
                            });
                            setSelectedClassifications(value);
                            dispatch(handleInput({ name: 'classifications', value: selectedIds }));
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
                        onClick={() => dispatch(handleNestedOpen())}
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
                    onChange={
                        event => dispatch(
                            handleInput(
                                {
                                    name: 'reason',
                                    value: event.target.value
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