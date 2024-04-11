import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import DataTable, { TableColumn } from 'react-data-table-component'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Alert } from '@mui/material'
import { Input } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'
import { getStepData, getStepGuide } from '@api/client'
import { loadEditReviewerForm, handleCloseReviewersModal } from '@api/steps/reviewers'
import { formValidator, Wizard } from '@features/wizard/wizardSlice'
import { handleOpen, Modal } from '@features/modal/modalSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { handleLoading } from '@features/submission/steps/reviewers/reviewersSlice'

const FilterComponent = (
    { 
        filterText, 
        onFilter,
        onClear 
    }: { 
        filterText: string, 
        onFilter: ( event: React.ChangeEvent<HTMLInputElement> ) => void, 
        onClear: () => void }) => (
            <>
                <Input
                    variant="soft"
                    size="sm"
                    id="search"
                    type="text"
                    placeholder="Filter By Name"
                    aria-label="Search Input"
                    autoComplete="off"
                    onChange={onFilter}
                    endDecorator={<i className="fa-duotone fa-remove" onClick={onClear}></i>}
                />
            </>
);

const ReviewersStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string 
        }, 
        ref 
    ) => {
    const dispatch: ThunkDispatch<any, void, any> = useDispatch();
    const formState = useSelector( ( state: any ) => state.reviewers );
    const wizard: Wizard = useSelector( ( state: any ) => state.wizard );
    const modal: Modal = useSelector( ( state: any ) => state.modal );
    const [filteredItems, setFilteredItems] = useState([]);
    useEffect(() => {
        dispatch( formValidator( true ) );
    }, []);
    useImperativeHandle(ref, () => ({
        async submitForm () {
            dispatch( handleLoading( true ) );
            let isAllowed = true;  
        
            return isAllowed;
        }
    }));
    const deleteReviewerUrl = 
        `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }/remove`;
    const columns: TableColumn<
        { 
            email: string, 
            firstname: string, 
            lastname: string, 
            suggested_opposed: string, 
            actions: any 
        }>[] = [
        {
          name: 'Email',
          selector: row => row.email,
          sortable: true,
          reorder: true
        },
        {
            name: 'First Name',
            selector: row => row.firstname,
            sortable: true,
            reorder: true
        },
        {
            name: 'Last Name',
            selector: row => row.lastname,
            sortable: true,
            reorder: true
        },
        {
            name: 'Suggested/Opposed',
            selector: row => row.suggested_opposed,
            sortable: true,
            reorder: true
        },
        {
            name: 'Actions',
            cell: ( row ) => (
              <div className="d-flex align-items-center justify-content-center flex-wrap">
                <Button
                  className="me-2 py-2"  
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ minWidth: 0 }}
                  onClick={ () => dispatch( loadEditReviewerForm( row.email ) ) }
                >
                  <i className="fa-duotone fa-edit"></i>
                </Button>
                <Button
                  className="py-2"
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ minWidth: 0 }}
                  onClick={ () => dispatch( handleDialogOpen( 
                    { 
                        actions: { deleteReviewer: deleteReviewerUrl }, 
                        data: row.email, 
                        dialogTitle: 'Delete Reviewer', 
                        dialogContent: { content: 'Are you sure?' }, 
                        dialogAction: 'delete-reviewer' } 
                        ) ) 
                    }
                >
                  <i className="fa-duotone fa-trash"></i>
                </Button>
              </div>
            ),
        },
    ];
    const [filterText, setFilterText] = useState<string>();
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent   
                filterText={filterText || ''}
                onFilter={ event => setFilterText(event.target.value)}
                onClear={ handleClear }
            />
		);
	}, [filterText, resetPaginationToggle]);
    useEffect(() => {
        const filteredData = formState.reviewersList.filter( ( item: any ) => {
            const rowValues = Object.values( item );
            return rowValues.some((value) => {
                if ( typeof value === 'string' ) {
                    const formattedValue = value.replace(/\s/g, '').toLowerCase();
                    const formattedFilterText = filterText?.replace(/\s/g, '').toLowerCase().trim() || '';
                    
                    return formattedValue.includes(formattedFilterText);
                }
                return false;
            });
        });
        setFilteredItems( filteredData );
      }, [formState.reviewersList, filterText, wizard.formStep]);

    return (
        <>
            <StepPlaceholder/>
            <div 
                id="reviewers" 
                className={ `tab ${ 
                    ( formState.isLoading || typeof formState.stepGuide !== 'string' ) 
                        ? ' d-none' 
                        : ' d-block' 
                    }` 
                }
            >
                <h3 className="mb-4 text-shadow-white">
                    Reviewers
                </h3>
                {
                    ( props.details !== undefined && props.details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( props.details ) }
                        </Alert>
                }
                {   
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' &&  
                        <Scrollbars
                            className="mb-4"
                            style={{ width: 100 + '%', height: 200 }}
                            universal={true}
                            autoHide
                            autoHideTimeout={500}
                            autoHideDuration={200}>
                            {   formState.stepGuide !== undefined &&     
                                <Alert severity="info" className="mb-4">
                                    { ReactHtmlParser( formState.stepGuide ) }
                                </Alert>
                            }
                        </Scrollbars>
                }
                <Button 
                    className="btn btn-primary btn-lg mb-4" 
                    onClick={ 
                        () => dispatch( 
                            handleOpen( 
                                { 
                                    title: 'Add an Reviewer', 
                                    parent: wizard.formStep 
                                } 
                            ) 
                        ) 
                    }
                >
                    Add Reviewer
                </Button>
                {
                    formState.reviewersList.length > 0 &&
                        <DataTable className="datatable-container"
                            title={<h4 className="fs-6 mb-0">Reviewers List</h4>}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            persistTableHead
                            pagination
                            columns={columns}
                            data={filteredItems}
                        />
                }
            </div>
        </>
    );
});

ReviewersStep.displayName = 'ReviewersStep';

export default ReviewersStep;