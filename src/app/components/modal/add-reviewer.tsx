import { useState, useEffect } from 'react'
import { AnyAction } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { List, ListItem, ListItemText } from '@mui/material'
import { Autocomplete, Input, FormControl, FormLabel, FormHelperText, Textarea, Button, Divider } from '@mui/joy'
import { modalState, handleInputChange, handleNestedOpen, handleNestedClose } from '@/app/features/modal/modalSlice'
import { addReviewerModalState, handleSelection, handleClassifications } from '@/app/features/modal/addReviewerModalSlice' 
import { getClassifications } from '@/app/api/client'
import { Modal, ModalDialog } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'

const AddReviewerModal = () => {
    const dispatch = useDispatch();
    const thunkDispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const modalData = useSelector( modalState );
    const addReviewerFormData = useSelector( addReviewerModalState );
    const [ selectedClassifications , setSelectedClassifications ] = useState<{ classification: string }[]>([]);
    const [ disabledClassifications, setDisabledClassifications ] = useState<{ [key: string]: boolean }>({});
    const formIsValid = modalData.isFormValid;
    const [ isValid, setIsValid ] = useState( {
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
    }
    useEffect( () => {
        if ( modalData.modalForm === 'reviewers' ) {
            thunkDispatch( getClassifications( './../api/classifications-list.json' ) );
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

    useEffect( () => {
       
    }, [addReviewerFormData]);

    return (
        <>
            <Modal id="classificationsModal"
                open={modalData.nestedModalOpen}
                aria-labelledby="nested-modal-title"
                aria-describedby="nested-modal-description">
                <ModalDialog sx={{ width: 600 }}>
                    <div className="modal-header d-block">
                        <h2 id="parent-modal-title" 
                        className="fs-4 text-center text-green fw-bold container-fluid mb-4">
                            Classifications
                        </h2>
                        <Divider className="container-fluid mb-4"/>
                    </div>
                    <div className="modal-body">
                        <Scrollbars
                            className="mb-4"
                            style={{ width: 100 + '%', height: 300 }}
                            universal={true}
                            autoHide
                            autoHideTimeout={300}
                            autoHideDuration={300}>
                            <div className="d-flex align-items-start">
                                <div className="border-end flex-fill pe-4">
                                    <h5 className="fs-7 fw-bold text-muted">Available Classifications</h5>
                                    <List>
                                        {
                                            addReviewerFormData.classifications.map( ( item: any, index: number ) => {
                                                return (
                                                    <ListItem className="mb-2 bg-light rounded" key={index}>
                                                        <ListItemText>
                                                            { item }
                                                        </ListItemText>
                                                        <Button size="sm" 
                                                            onClick={ () => selectClassification( item ) } 
                                                            disabled={ disabledClassifications[item] }>
                                                            <i className="fa-duotone fa-angle-right"></i>
                                                        </Button>
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>
                                </div>
                                <div className="flex-fill ps-4">
                                    <h5 className="fs-7 fw-bold text-muted">Selected Classifications</h5>
                                    <List id="selected-classifications">
                                        {selectedClassifications.map((item: any, index: any) => (
                                            <ListItem className="mb-2 bg-light rounded" key={index}>
                                                <ListItemText>{ item }</ListItemText>
                                                <Button color="danger" size="sm" onClick={ () => removeClassification( index, item )}>
                                                    <i className="fa-duotone fa-remove"></i>
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </div>
                        </Scrollbars>
                    </div>
                    <div className="modal-footer">
                        <Button className="button btn_primary"
                            onClick={() =>  {
                                    dispatch( handleClassifications( selectedClassifications ) );
                                    dispatch( handleNestedClose() );
                                }
                            }>
                            Add
                        </Button>
                    </div>
                </ModalDialog>
            </Modal>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Suggest or Oppose
                </FormLabel>
                <Autocomplete
                    required
                    color="neutral"
                    size="md"
                    variant="soft"
                    placeholder="Choose one…"
                    disabled={false}
                    disableClearable={true}
                    name="suggestOrOppose"
                    id="suggestOrOppose"
                    options={ addReviewerFormData.suggestOrOpposeList }
                    value={ addReviewerFormData.suggestOrOppose }
                    onChange={(event, value) => {
                        dispatch( handleSelection( { name: 'suggestOrOppose' , value: value } ) );
                    }}
                />
            </FormControl>
            <FormControl className="mb-3" error={ !isValid.reviewerEmail && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Email
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="reviewerEmail"
                    id="reviewerEmail"
                    placeholder="Reviewer's Email"
                    onChange={ event => dispatch( handleInputChange( { name: 'reviewerEmail', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.reviewerEmail && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                }
            </FormControl>
            <FormControl className="mb-3" error={ !isValid.reviewerFirstName && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    First Name
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="reviewerFirstName"
                    id="reviewerFirstName"
                    placeholder="Reviewer's First Name"
                    onChange={ event => dispatch( handleInputChange( { name: event.target.name, value: event.target.value } ) ) }
                />
                {
                    ( !isValid.reviewerFirstName && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                }
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Middle Name
                </FormLabel>
                <Input
                    variant="soft"
                    name="reviewerMiddleName"
                    id="reviewerMiddleName"
                    placeholder="Reviewer's Middle Name"
                    onChange={ event => dispatch( handleInputChange( { name: event.target.name, value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-3" error={ !isValid.reviewerLastName && !formIsValid }>
                <FormLabel className="fw-bold mb-1">
                    Last Name
                </FormLabel>
                <Input
                    required
                    variant="soft"
                    name="reviewerLastName"
                    id="reviewerLastName"
                    placeholder="Reviewer's Last Name"
                    onChange={ event => dispatch( handleInputChange( { name: event.target.name, value: event.target.value } ) ) }
                />
                {
                    ( !isValid.reviewerLastName && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Oops! something went wrong.</FormHelperText> 
                }
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Academic Degree
                </FormLabel>
                <Autocomplete
                    required
                    color="neutral"
                    size="md"
                    variant="soft"
                    placeholder="Choose one…"
                    disabled={false}
                    disableClearable={true}
                    name="academicDegree"
                    id="academicDegree"
                    options={ addReviewerFormData.academicDegreeList }
                    value={ addReviewerFormData.academicDegree }
                    onChange={(event, value) => {
                        dispatch( handleSelection({ name: 'academicDegree' , value: value } ) );
                    }}
                />
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Department
                </FormLabel>
                <Input
                    variant="soft"
                    name="reviewerDepartment"
                    id="reviewerDepartment"
                    placeholder="Reviewer's Department"
                    onChange={ event => dispatch( handleInputChange( { name: event.target.name, value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    University
                </FormLabel>
                <Input
                    variant="soft"
                    name="reviewerUniversity"
                    id="reviewerUniversity"
                    placeholder="Reviewer's University"
                    onChange={ event => dispatch( handleInputChange( { name: event.target.name, value: event.target.value } ) ) }
                />
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Type Classifications
                </FormLabel>
                <div className="d-flex align-items-center">
                    <Autocomplete
                        multiple
                        className="flex-fill"
                        color="neutral"
                        size="md"
                        variant="soft"
                        placeholder="Classification Name"
                        disabled={false}
                        disableClearable={true}
                        name="classifications"
                        id="classifications"
                        options={ addReviewerFormData.classifications }
                        value={ addReviewerFormData.selectedClassifications }
                        onInputChange={handleInputChange}
                        onChange={(event, value) => {
                            dispatch( handleSelection({ name: 'selectedClassifications' , value: value } ) );
                        }}
                        getOptionDisabled={(option: any) => !!option.disabled}
                        filterOptions={ ( options, state ) => {
                            if ( state.inputValue.length >= 3 ) {
                            options = addReviewerFormData.classifications;
                            return options.filter((item) =>
                                String(item).toLowerCase().includes(state.inputValue.toLowerCase())
                            );
                            } else {
                                options = [{ label: 'Please enter 3 or more characters...', disabled: true }];
                            }
                            return options;
                        }}
                    />
                    <Button className="btn btn-primary ms-2" onClick={ () => dispatch( handleNestedOpen() ) }>
                        Add
                    </Button>
                </div>
            </FormControl>
            <FormControl className="mb-3">
                <FormLabel className="fw-bold mb-1">
                    Reason
                </FormLabel>
                <Textarea
                    variant="soft"
                    name="reviewerReason"
                    id="reviewerReason"
                    minRows={3}
                    aria-label="textarea"
                    placeholder="Describe your Reason..."
                />
            </FormControl>
        </>
    );
}

export default AddReviewerModal;