import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import ModalContent from '@/components/modal'
import { useMemo, useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { Alert, Box, Button, Link, Typography } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faEdit, faTrash } from '@fortawesome/pro-duotone-svg-icons'
import { type Author } from '@/app/services/types/author'
import useMessageHandler from '@/app/services/messages'
import AddAuthorModal from '@/components/modal/forms/add-author'
import {
  useGetAuthorsAffiliationsQuery,
  createAuthorsTable,
  useUpdateAuthorsOrderMutation
} from '@/app/services/steps/authors'

interface ChildComponentProps {
  resetForm: () => Promise<boolean>;
  handleAuthorOperation: () => Promise<boolean>;
}

const AuthorsStep = forwardRef(
  (
    props: {
      apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
      details: string,
      workflowId: string
    },
    ref
  ) => {
    const { messageHandler } = useMessageHandler();
    const childRef = useRef<ChildComponentProps>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [filteredItems, setFilteredItems] = useState<object[]>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const isRevision = useAppSelector((state: any) => state.wizard.isRevision);
    const [modalFormData, setModalFormData] = useState<Author>({
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
    const {
      data: authorsAffiliations,
      isLoading: authorsAffiliationsIsLoading
    } = useGetAuthorsAffiliationsQuery(props.workflowId);
    const {
      data: stepGuide,
      isLoading: stepGuideIsLoading
    } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
    const {
      data: stepData,
      isLoading: stepDataIsLoading
    } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
    const [updateAuthorsOrderTrigger] = useUpdateAuthorsOrderMutation();
    const isLoading: boolean = (
      authorsAffiliationsIsLoading &&
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
        setFilteredItems(createAuthorsTable(stepData));
      }
      isInitialMount.current = false;
    }, [stepData]);
    useImperativeHandle(ref, () => ({
      async submitForm() {
        let isAllowed = true;

        return isAllowed;
      }
    }));
    const handleAuthorAction = async () => {
      const addAuthorSuccess = childRef.current && await childRef.current.handleAuthorOperation();
      addAuthorSuccess && setIsModalOpen(false);
    }
    const setModalClose = () => {
      childRef.current && childRef.current.resetForm();
      setModalFormData({
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
      setIsModalOpen(false);
      setIsEditing(false);
    }
    const deleteAuthorUrl =
      `${process.env.SUBMISSION_API_URL}/${props.workflowId}/authors/remove`;
    const columns = useMemo<MRT_ColumnDef<any>[]>(
      () => [
        {
          id: 'email',
          accessorKey: 'email',
          header: 'Email',
        },
        {
          id: 'firstname',
          accessorKey: 'firstname',
          header: 'First Name',
        },
        {
          id: 'lastname',
          accessorKey: 'lastname',
          header: 'Last Name',
        },
        {
          id: 'orcid',
          accessorKey: 'orcid',
          header: 'Orcid',
        },
        {
          id: 'iscorresponding',
          accessorKey: 'iscorresponding',
          header: 'is corresponding',
        },
        {
          id: 'actions',
          header: 'Actions',
          columnDefType: 'display',
          size: 75,
          Cell: ({ row }) => (
            <Box sx={{ display: 'flex' }}>
              <Button
                key="edit"
                className="me-2 py-2"
                variant="contained"
                color="success"
                size="small"
                sx={{ minWidth: 0, py: 1, mr: 1 }}
                onClick={() => {
                  setIsEditing(true);
                  const selectedAuthorToEdit = Object.keys(stepData).find((key) => {
                    const value = stepData[key];
                    if (value.email === row.original.email) {
                      return value;
                    }
                  }) || '';
                  setModalFormData({
                    email: stepData[selectedAuthorToEdit]['email'],
                    firstName: stepData[selectedAuthorToEdit]['first-name'],
                    middleName: stepData[selectedAuthorToEdit]['middle-name'],
                    lastName: stepData[selectedAuthorToEdit]['last-name'],
                    orcId: stepData[selectedAuthorToEdit]['orcid-id'],
                    country: stepData[selectedAuthorToEdit]['country'],
                    phoneType: stepData[selectedAuthorToEdit]['phone_type'][0],
                    countryPhone: stepData[selectedAuthorToEdit]['country_phone'][0],
                    phoneNumber: stepData[selectedAuthorToEdit]['phone_number'][0],
                    affiliations: stepData[selectedAuthorToEdit]['affiliations'],
                    isCorresponding: stepData[selectedAuthorToEdit]['is_corresponding'] ? 'on' : 'off',
                    correspondAffiliation: stepData[selectedAuthorToEdit]['correspond_affiliation']
                  });
                  setIsModalOpen(true);
                }}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              {
                (!isRevision) &&
                <Button
                  key="delete"
                  className="py-2"
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ minWidth: 0, py: 1 }}
                  onClick={() => {
                    const authorKey = Object.keys(stepData).find((key) => {
                      const value = stepData[key];
                      if (value.email === row.original.email) {
                        return true;
                      }
                      return false;
                    }) || '';

                    dispatch(
                      handleDialogOpen(
                        {
                          actions: { deleteAuthor: deleteAuthorUrl },
                          data: authorKey,
                          dialogTitle: 'Delete Author',
                          dialogContent: { content: 'Are you sure?' },
                          dialogAction: 'delete-author'
                        }
                      ))
                  }
                  }
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              }
            </Box>
          ),
        },
      ], [stepData]);

    return (
      <>
        <ModalContent
          isOpen={isModalOpen}
          onClose={() => setModalClose()}
          modalTitle="Add Author"
          modalActions={
            <Button
              variant="contained"
              color="success"
              size='large'
              onClick={() => handleAuthorAction()}
            >
              {
                isEditing ? 'Edit' : 'Add'
              }
            </Button>
          }>
          <Box px={3}>
            <AddAuthorModal
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
            :
            <Box id="authors" className="relative z-10">
              <Typography variant="h3" mb={2}>
                Authors
              </Typography>
              {
                (props.details !== undefined && props.details !== '') &&
                <Alert color="error" sx={{ mb: 3, p: 3 }}>
                  {
                    ReactHtmlParser(props.details)
                  }
                </Alert>
              }
              <Box mb={3}>
                <Scrollbars
                  style={{ width: 100 + '%', minHeight: 150 }}
                  universal={true}
                  autoHide
                  autoHideTimeout={500}
                  autoHideDuration={300}>
                  {
                    typeof stepGuide === 'string' && stepGuide.trim() !== '' &&
                    <Alert color="info" sx={{ mb: 3, p: 3 }}>
                      {
                        ReactHtmlParser(stepGuide)
                      }
                    </Alert>
                  }
                </Scrollbars>
              </Box>
              {
                !isRevision &&
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  <Typography component="span" pl={1} fontWeight={700}>
                    Add Author
                  </Typography>
                </Button>
              }
              {
                filteredItems && filteredItems?.length > 0 &&
                <Box className="datatable-container" mb={3}>
                  <MaterialReactTable
                    autoResetPageIndex={false}
                    enableSorting={true}
                    columns={columns}
                    data={filteredItems}
                    enableRowNumbers
                    enableDensityToggle={false}
                    enableColumnFilters={false}
                    enableFullScreenToggle={false}
                    enableHiding={false}
                    enableRowOrdering
                    muiTopToolbarProps={{
                      sx: {
                        backgroundColor: 'transparent'
                      }
                    }}
                    muiBottomToolbarProps={{
                      sx: {
                        backgroundColor: 'transparent'
                      }
                    }}
                    muiTablePaperProps={{
                      sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                      }
                    }}
                    muiTableBodyRowDragHandleProps={({ table }) => ({
                      onDragEnd: () => {
                        const { draggingRow, hoveredRow }: { draggingRow: any, hoveredRow: any } = table.getState();
                        if (hoveredRow && draggingRow) {
                          const itemsCopy = [...filteredItems];
                          const draggedItem = itemsCopy.splice(draggingRow.index, 1)[0];
                          itemsCopy.splice(hoveredRow.id, 0, draggedItem);
                          const reorderedAuthors: any = [];
                          itemsCopy.forEach((author: any) => {
                            Object.entries(stepData).forEach(([key, value]) => {
                              const authorItem: any = value;
                              if (authorItem.email === author.email) {
                                reorderedAuthors.push(key);
                              }
                            });
                          });
                          const newOrder = {
                            "ids": reorderedAuthors
                          };
                          updateAuthorsOrderTrigger(
                            {
                              workflowId: props.workflowId,
                              data: newOrder
                            }
                          ).then((response: any) => {
                            messageHandler(
                              response,
                              {
                                errorMessage: `Failed to reorder authors`,
                                successMessage: `Authors reordered successfuly`
                              },
                              false
                            );
                          });
                        }
                      },
                    })}
                  />
                </Box>
              }
              {
                (authorsAffiliations !== undefined && Object.keys(authorsAffiliations).length > 0) &&
                <Box id="affiliations">
                  <Box id="authors-list">
                    {
                      authorsAffiliations.names.map((item: any, index: number) => (
                        <Typography mb={1} key={`author-${index}`}>
                          <Typography fontWeight="bold" variant="muted" pr={1}>
                            {`${item.first_name} ${item.middle_name || ''} ${item.last_name}`}
                          </Typography>
                          {item['orcid-id']
                            ? <Link href={`https://orcid.org/${item['orcid-id']}`}>
                              <img
                                className="ms-1"
                                src="https://orcid.org/sites/default/files/images/orcid_16x16.png"
                                width="15"
                                height="15" title="ORCID" alt="ORCID"
                              />
                            </Link>
                            : ''
                          }
                          <sup className="ms-1">
                            {`${item.affiliations.map((affiliation: number) => affiliation)} ${item.cor || ''}`}
                          </sup>
                        </Typography>
                      ))
                    }
                  </Box>
                  <Box id="authors-affiliations">
                    {
                      authorsAffiliations.affiliations.map((item: any, index: number) => (
                        <Typography component="span" key={`affiliation-${index}`} fontSize={12}>
                          {`${index + 1} ${item}`}
                        </Typography>
                      ))
                    }
                  </Box>
                  <Box id="authors-affiliations">
                    {
                      Object.entries(authorsAffiliations.correspondings).map(([key, value]) => (
                        <Typography key={`corresponding-${key}`} fontSize={12}>
                          {`${key} ${value}`}
                        </Typography>
                      ))
                    }
                  </Box>
                </Box>
              }
            </Box>
        }
      </>
    );
  });

AuthorsStep.displayName = 'AuthorsStep';

export default AuthorsStep;