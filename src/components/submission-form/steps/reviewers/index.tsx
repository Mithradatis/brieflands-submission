import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import DataTable, { TableColumn } from 'react-data-table-component'
import useMessageHandler from '@/app/services/messages'
import ModalContent from '@/components/modal'
import AddReviewerModal from '@/components/modal/forms/add-reviewer'
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle, useRef } from 'react'
import { useAppDispatch } from '@/store/store'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import { useGetReviewersQuery, createReviewersTable } from '@/app/services/steps/reviewers'
import { Reviewer } from '@/app/services/types/reviewers'
import { Scrollbars } from 'react-custom-scrollbars'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRemove, faEdit, faTrash } from '@fortawesome/pro-duotone-svg-icons'
import {
    Alert,
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material'

const FilterComponent = (
    {
        filterText,
        onFilter,
        onClear
    }: {
        filterText: string,
        onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void,
        onClear: () => void
    }) => (
    <>
        <TextField
            variant="filled"
            size="small"
            id="search"
            type="text"
            placeholder="Filter By Name"
            aria-label="Search Input"
            autoComplete="off"
            onChange={onFilter}
            InputProps={{
                startAdornment:
                    <InputAdornment position="start">
                        <FontAwesomeIcon icon={faRemove} onClick={onClear} />
                    </InputAdornment>,
            }}
        />
    </>
);

interface ChildComponentProps {
    resetForm: () => Promise<boolean>;
    handleReviewerOperation: () => Promise<boolean>;
}

const ReviewersStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string,
            workflowId: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const { messageHandler } = useMessageHandler();
        const childRef = useRef<ChildComponentProps>(null);
        const [isEditing, setIsEditing] = useState<boolean>(false);
        const [filteredItems, setFilteredItems] = useState<any>([]);
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const [modalFormData, setModalFormData] = useState<Reviewer>({
            email: '',
            firstName: '',
            middleName: '',
            lastName: '',
            department: '',
            reason: '',
            university: '',
            suggestOrOppose: 0,
            academicDegree: '',
            classification: 0
        });
        const {
            data: reviewersList,
            isLoading: reviewersListIsLoading
        } = useGetReviewersQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepGuide,
            isLoading: stepGuideIsLoading
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepData,
            isLoading: stepDataIsLoading
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (
            stepGuideIsLoading &&
            stepDataIsLoading &&
            typeof stepGuide !== 'string'
        );
        const isInitialMount = useRef(true);
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        useEffect(() => {
            if (stepData && !isInitialMount.current) {
                setFilteredItems(createReviewersTable(stepData));
            }
            isInitialMount.current = false;
        }, [stepData]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = true;

                return isAllowed;
            }
        }));
        const handleReviewerAction = () => {
            const addAuthorSuccess = childRef.current && childRef.current.handleReviewerOperation();
            addAuthorSuccess && setIsModalOpen(false);
        }
        const setModalClose = () => {
            childRef.current && childRef.current.resetForm();
            setModalFormData({
                email: '',
                firstName: '',
                middleName: '',
                lastName: '',
                department: '',
                reason: '',
                university: '',
                suggestOrOppose: 0,
                academicDegree: '',
                classification: 0
            });
            setIsModalOpen(false);
            setIsEditing(false);
        }
        const deleteReviewerUrl =
            `${process.env.SUBMISSION_API_URL}/${props.workflowId}/reviewers/remove`;
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
                    cell: (row) => (
                        <Stack direction="row" alignItems="center" justifyContent="center" className="flex-wrap">
                            <Button
                                className="me-2 py-2"
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ minWidth: 0 }}
                                onClick={() => { }}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                                className="py-2"
                                variant="contained"
                                color="info"
                                size="small"
                                sx={{ minWidth: 0 }}
                                onClick={() => dispatch(handleDialogOpen(
                                    {
                                        actions: { deleteReviewer: deleteReviewerUrl },
                                        data: row.email,
                                        dialogTitle: 'Delete Reviewer',
                                        dialogContent: { content: 'Are you sure?' },
                                        dialogAction: 'delete-reviewer'
                                    }
                                ))
                                }
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </Stack>
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
                    onFilter={event => setFilterText(event.target.value)}
                    onClear={handleClear}
                />
            );
        }, [filterText, resetPaginationToggle]);
        useEffect(() => {
            if (reviewersList?.length > 0) {
                const filteredData = reviewersList.filter((item: any) => {
                    const rowValues = Object.values(item);
                    return rowValues.some((value) => {
                        if (typeof value === 'string') {
                            const formattedValue = value.replace(/\s/g, '').toLowerCase();
                            const formattedFilterText = filterText?.replace(/\s/g, '').toLowerCase().trim() || '';

                            return formattedValue.includes(formattedFilterText);
                        }
                        return false;
                    });
                });
                setFilteredItems(filteredData);
            }
        }, [reviewersList, filterText]);

        return (
            <>
                <ModalContent
                    isOpen={isModalOpen}
                    onClose={() => setModalClose()}
                    modalTitle="Add Reviewer"
                    modalActions={
                        <Button
                            variant="contained"
                            color="success"
                            size='large'
                            onClick={() => handleReviewerAction()}
                        >
                            {
                                isEditing ? 'Edit' : 'Add'
                            }
                        </Button>
                    }>
                    <Box px={3}>
                        <AddReviewerModal
                            isEditing={isEditing}
                            workflowId={props.workflowId}
                            modalFormData={modalFormData}
                            ref={childRef}
                        />
                    </Box>
                </ModalContent>
                {
                    isLoading
                        ? <StepPlaceholder />
                        : <Box>
                            <Typography variant="h3" mb={2}>
                                Reviewers
                            </Typography>
                            {
                                (props.details !== undefined && props.details !== '') &&
                                <Alert color="error" sx={{ mb: 3, p: 2 }}>
                                    {
                                        ReactHtmlParser(props.details)
                                    }
                                </Alert>
                            }
                            {
                                typeof stepGuide === 'string' && stepGuide.trim() !== '' &&
                                <Scrollbars
                                    className="mb-4"
                                    style={{ width: 100 + '%', height: 200 }}
                                    universal={true}
                                    autoHide
                                    autoHideTimeout={500}
                                    autoHideDuration={200}>
                                    {stepGuide !== undefined &&
                                        <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                            {
                                                ReactHtmlParser(stepGuide)
                                            }
                                        </Alert>
                                    }
                                </Scrollbars>
                            }
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                sx={{ mb: 3 }}
                                onClick={() => {
                                    setIsModalOpen(true)
                                }}
                            >
                                <Typography component="span" fontWeight={700}>
                                    Add Reviewer
                                </Typography>
                            </Button>
                            {
                                reviewersList?.length > 0 &&
                                <DataTable className="datatable-container"
                                    title={<Typography variant="h4">Reviewers List</Typography>}
                                    subHeader
                                    subHeaderComponent={subHeaderComponentMemo}
                                    persistTableHead
                                    pagination
                                    columns={columns}
                                    data={filteredItems}
                                />
                            }
                        </Box>
                }
            </>
        );
    });

ReviewersStep.displayName = 'ReviewersStep';

export default ReviewersStep;