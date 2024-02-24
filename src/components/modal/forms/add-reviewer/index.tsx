import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, ListItem, ListItemText } from '@mui/material'
import { Autocomplete, Input, FormControl, FormLabel, FormHelperText, Textarea, Button, Divider, createFilterOptions } from '@mui/joy'
import { handleNestedOpen, handleNestedClose } from '@/lib/features/modal/modalSlice'
import { handleInput, handleClassifications } from '@/lib/features/modal/addReviewerModalSlice' 
import { getClassificationsList } from '@/lib/api/steps/classifications'
import { Modal, ModalDialog } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'

const AddReviewerModal = () => {
    const filter = createFilterOptions();
    const dispatch: any = useDispatch();
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const modalData = useSelector( ( state: any ) => state.modalSlice );
    const addReviewerFormData = useSelector( ( state: any ) => state.addReviewerModalSlice );
    const [ selectedClassifications , setSelectedClassifications ] = useState<{ classification: string }[]>([]);
    const [ disabledClassifications, setDisabledClassifications ] = useState<{ [key: string]: boolean }>({});
    const formIsValid = modalData.isFormValid;
    const [ reviewerSuggestedOrOpposed, setReviewerSuggestedOrOpposed ]: any = useState({});
    const [ reviewerAcademicDegree, setReviewerAcademicDegree ]: any = useState({});
    const [ reviewerClassifications, setReviewerClassifications ]: any = useState([]);
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
    };
    useEffect( () => {
        const classificationsUrl = `${ process.env.API_URL }/journal/classification`;
        dispatch( getClassificationsList( classificationsUrl ) );
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
        const suggestedOrOpposed: any = addReviewerFormData.suggestOrOpposeList.find( ( item: any ) => item.id === parseInt( addReviewerFormData.value['suggest-or-oppose'] ) )?.title;
        const academicDegree: any = addReviewerFormData.academicDegreeList.find( ( item: any ) => item.id === parseInt( addReviewerFormData.value['academic-degree'] ) )?.title;
        const selectedClassificationIds = addReviewerFormData.value['classifications'];
        const classifications: any[] = selectedClassificationIds?.map((classificationId: string) => {
            return addReviewerFormData.classificationsList.find( ( item: any ) => item.id === classificationId ).id;
        });
        setReviewerSuggestedOrOpposed( suggestedOrOpposed ? suggestedOrOpposed : '' );
        setReviewerAcademicDegree( academicDegree ? academicDegree : '' );
        setReviewerClassifications( classifications ? classifications : [] );
    }, [addReviewerFormData.value]);
    

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
                                        {addReviewerFormData.classificationsList?.map((item: any, index: number) => {
                                            return (
                                            <ListItem className="mb-2 bg-light rounded" key={index}>
                                                <ListItemText>
                                                    { item.attributes.title }
                                                </ListItemText>
                                                <Button
                                                    size="sm"
                                                    onClick={ () => {
                                                        const selectedIds: any = [];
                                                        selectedIds.push( item.id );
                                                        selectClassification( item.attributes.title );
                                                        dispatch( handleInput( { name: 'classifications', value: selectedIds } ) );
                                                    }}
                                                    disabled={disabledClassifications[item.attributes.title]}
                                                >
                                                <i className="fa-duotone fa-angle-right"></i>
                                                </Button>
                                            </ListItem>
                                            );
                                        })}
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
                    disableClearable={true}
                    name="suggestOrOppose"
                    id="suggestOrOppose"
                    options={
                        Array.isArray( addReviewerFormData.suggestOrOpposeList ) 
                        ? addReviewerFormData.suggestOrOpposeList.map( 
                            ( item: any ) => {
                                return item.title || '' 
                            }
                           ) : []
                    }
                    value={ reviewerSuggestedOrOpposed }
                    onChange={(event, value) => {
                        dispatch( handleInput({ 
                                name: 'suggest-or-oppose',
                                value: addReviewerFormData.suggestOrOpposeList.find( 
                                    ( item: any ) => item.title === value )?.id || '' } 
                                    ) 
                                )
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
                    defaultValue={ addReviewerFormData.value['email'] }
                    onChange={ event => dispatch( handleInput( { name: 'email', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.reviewerEmail && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Please enter reviewer email</FormHelperText> 
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
                    defaultValue={ addReviewerFormData.value['first-name'] }
                    onChange={ event => dispatch( handleInput( { name: 'first-name', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.reviewerFirstName && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Please enter reviewer first name</FormHelperText> 
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
                    defaultValue={ addReviewerFormData.value['middle-name'] }
                    onChange={ event => dispatch( handleInput( { name: 'middle-name', value: event.target.value } ) ) }
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
                    defaultValue={ addReviewerFormData.value['last-name'] }
                    onChange={ event => dispatch( handleInput( { name: 'last-name', value: event.target.value } ) ) }
                />
                {
                    ( !isValid.reviewerLastName && !formIsValid ) 
                    && <FormHelperText className="fs-7 text-danger mt-1">Please enter reviewer last name</FormHelperText> 
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
                    // options={ addReviewerFormData.academicDegreeList }
                    // value={ reviewerAcademicDegree }
                    // onChange={(event, value) => {
                    //     dispatch( handleInput({ name: 'academic-degree' , value: value.toString() } ) );
                    // }}
                    options={
                        Array.isArray( addReviewerFormData.academicDegreeList ) 
                        ? addReviewerFormData.academicDegreeList.map( 
                            ( item: any ) => {
                                return item.title || '' 
                            }
                           ) : []
                    }
                    value={ reviewerAcademicDegree }
                    onChange={(event, value) => {
                        dispatch( handleInput({ 
                                name: 'academic-degree',
                                value: addReviewerFormData.academicDegreeList.find( 
                                    ( item: any ) => item.title === value )?.id || '' } 
                                    ) 
                                )
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
                    defaultValue={ addReviewerFormData.value['department'] }
                    onChange={ event => dispatch( handleInput( { name: 'department', value: event.target.value } ) ) }
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
                    defaultValue={ addReviewerFormData.value['university'] }
                    onChange={ event => dispatch( handleInput( { name: 'university', value: event.target.value } ) ) }
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
                        onInputChange={handleInput}
                        options={
                            Array.isArray( addReviewerFormData.classificationsList ) 
                            ? addReviewerFormData.classificationsList.map( 
                                ( item: any ) => {
                                    return item.attributes?.title || '' 
                                }
                               ) : []
                        }
                        value={
                            Array.isArray( addReviewerFormData.classificationsList )
                              ? addReviewerFormData.classificationsList
                                  .filter( ( item: any ) => reviewerClassifications.includes( item.id ) )
                                  .map( ( item: any ) => item.attributes.title )
                              : []
                        }
                        onChange={(event, value) => {
                            const selectedIds = value.map( ( selectedItem: any ) => {
                              const selectedOption = addReviewerFormData.classificationsList.find(
                                ( item: any ) => item.attributes.title === selectedItem
                              );
                              return selectedOption ? selectedOption.id : '';
                            });
                            setSelectedClassifications( value );
                            dispatch( handleInput( { name: 'classifications', value: selectedIds } ) );
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter( options, params );
                            const { inputValue } = params;
                            const isExisting = options.some((option) => inputValue === option);
                    
                            if (inputValue !== '' && !isExisting) {
                                filtered.push('Nothing found');
                            }
                    
                            return filtered.filter( ( option: any ) => {
                                return option !== 'Nothing found' || isExisting;
                            });
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
                    onChange={ event => dispatch( handleInput( { name: 'reason', value: event.target.value } ) ) }
                />
            </FormControl>
        </>
    );
}

export default AddReviewerModal;