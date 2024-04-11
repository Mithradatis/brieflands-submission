import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import ModalContent from '@/components/modal'
import { useMemo, useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Box, Button, Alert } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { formValidator } from '@features/wizard/wizardSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
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
  addAuthor: () => Promise<boolean>;
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
    const  { messageHandler } = useMessageHandler();
    const childRef = useRef<ChildComponentProps>(null);
    const [ isEditing, setIsEditing ] = useState<boolean>( false );
    const [ filteredItems, setFilteredItems ] = useState<object[]>();
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>( false );
    const dispatch = useAppDispatch();
    const isRevision = useAppSelector( ( state: any ) => state.wizard.isRevision );
    const [ modalFormData, setModalFormData ] = useState<Author>({
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
    } = useGetAuthorsAffiliationsQuery( props.workflowId );
    const { 
      data: stepGuide, 
      isLoading: stepGuideIsLoading 
    } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { 
      data: stepData, 
      isLoading: stepDataIsLoading
    } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const [ updateAuthorsOrderTrigger ] = useUpdateAuthorsOrderMutation();
    const isLoading: boolean = ( 
      authorsAffiliationsIsLoading && 
      stepGuideIsLoading && 
      stepDataIsLoading && 
      typeof stepGuide !== 'string' 
    );
    useEffect(() => {
      dispatch( formValidator( true ) );
      if ( stepData ) {
        setFilteredItems( createAuthorsTable( stepData ) );
      }
    }, [stepData]);
    useImperativeHandle(ref, () => ({
      async submitForm () {
        let isAllowed = true;  
        
        return isAllowed;
      }
    }));
    const handleAddAuthor = () => {
      const addAuthorSuccess = childRef.current && childRef.current.addAuthor();
      addAuthorSuccess && setIsModalOpen( false );
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
      setIsModalOpen( false );
      setIsEditing( false );
    }
    const deleteAuthorUrl = 
        `${ process.env.SUBMISSION_API_URL }/${ props.workflowId }/authors/remove`;
    const columns = useMemo<MRT_ColumnDef<any>[]>(
      () => [  
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'firstname',
          header: 'First Name',
        },
        {
          accessorKey: 'lastname',
          header: 'Last Name',   
        },
        {
          accessorKey: 'orcid',
          header: 'Orcid',   
        },
        {
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
                color="primary"
                size="small"
                sx={{ minWidth: 0 }}
                onClick={ () => { 
                  setIsEditing( true ); 
                  const selectedAuthorToEdit = Object.keys( stepData ).find( ( key ) => {
                    const value = stepData[key];
                    if ( value.email === row.original.email ) {
                        return value;
                    }
                  }) || '';
                  setModalFormData( {
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
                  setIsModalOpen( true );
                }}>
                <i className="fa-duotone fa-edit"></i>
              </Button>
              {
                ( !isRevision ) &&
                  <Button 
                    key="delete"
                    className="py-2"
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ minWidth: 0 }}
                    onClick={() => { 
                      const authorKey = Object.keys( stepData ).find( ( key ) => {
                        const value = stepData[key];
                        if ( value.email === row.original.email ) {
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
                            dialogAction: 'delete-author' } 
                        ) )
                      }
                    }
                  >
                    <i className="fa-duotone fa-trash"></i>
                  </Button>
              }
            </Box>
          ),
        },
    ], [stepData]);

    return (
      <>
        <ModalContent
          isOpen={ isModalOpen } 
          onClose={ () => setModalClose() } 
          modalTitle="Add Author" 
          modalActions={
            <Button onClick={() => handleAddAuthor()}>
              { isEditing ? 'Edit' : 'Add' }
            </Button>
          }>
            <div className="px-4">
              <AddAuthorModal 
                isEditing={ isEditing } 
                workflowId={ props.workflowId }
                modalFormData={ modalFormData }
                ref={ childRef }
              />
            </div>
        </ModalContent>  
        {
          isLoading
            ? <StepPlaceholder/>
            : 
              <div id="authors" className="tab">
                  <h3 className="mb-4 text-shadow-white">Authors</h3>
                  {
                      ( props.details !== undefined && props.details !== '' ) &&
                          <Alert severity="error" className="mb-4">
                              { ReactHtmlParser( props.details ) }
                          </Alert>
                  }
                  <Scrollbars
                      className="mb-2"
                      style={{ width: 100 + '%', minHeight: 150 }}
                      universal={true}
                      autoHide
                      autoHideTimeout={500}
                      autoHideDuration={200}>
                      {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' &&
                          <Alert severity="info" className="mb-4">
                              { ReactHtmlParser( stepGuide ) }
                          </Alert>
                      }
                  </Scrollbars>
                  {
                    !isRevision && 
                      <Button className="btn btn-primary btn-lg mb-0" onClick={() => {
                        setIsModalOpen( true )
                      }}>
                        Add Author
                      </Button>
                  }
                  {
                    filteredItems && filteredItems?.length > 0 &&
                      <div className="datatable-container">
                          <MaterialReactTable
                            autoResetPageIndex={false}
                            enableSorting={true}
                            columns={columns}
                            data={ filteredItems }
                            enableRowNumbers
                            enableDensityToggle={false}
                            enableColumnFilters={false}
                            enableFullScreenToggle={false}
                            enableHiding={false}
                            enableRowOrdering
                            muiTableBodyRowDragHandleProps={({ table }) => ({
                              onDragEnd: () => {
                                const { draggingRow, hoveredRow }: { draggingRow: any, hoveredRow: any } = table.getState();
                                if ( hoveredRow && draggingRow ) {
                                  const itemsCopy = [...filteredItems];
                                  const draggedItem = itemsCopy.splice( draggingRow.index, 1 )[0];
                                  itemsCopy.splice( hoveredRow.id, 0, draggedItem );
                                  const reorderedAuthors: any = [];
                                  itemsCopy.forEach( ( author: any ) => {
                                    Object.entries( stepData ).forEach(([key, value]) => {
                                      const authorItem: any = value;
                                      if (authorItem.email === author.email) {
                                        reorderedAuthors.push( key );
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
                                  ).then( ( response: any ) => {
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
                      </div>
                  }
                  {
                    ( authorsAffiliations !== undefined && Object.keys( authorsAffiliations ).length > 0 ) &&
                      <div id="affiliations">
                        <div id="authors-list">
                          {
                            authorsAffiliations.names.map( ( item: any, index: number ) => (
                              <span key={ `author-${ index }` } className="me-2">
                                <span className="fw-bold text-muted">
                                  { `${ item.first_name } ${ item.middle_name || '' } ${ item.last_name }` }
                                </span>
                                { item['orcid-id']
                                  ? <a href={ `https://orcid.org/${ item['orcid-id'] }` }>
                                        <img 
                                          className="ms-1" 
                                          src="https://orcid.org/sites/default/files/images/orcid_16x16.png" 
                                          width="15" 
                                          height="15" title="ORCID" alt="ORCID"
                                        />
                                    </a>
                                    : '' 
                                }
                                <sup className="ms-1">
                                  { `${ item.affiliations.map( ( affiliation: number ) => affiliation ) } ${ item.cor || '' }` }
                                </sup>
                              </span>
                            ))
                          }
                        </div>
                        <div id="authors-affiliations" className="fs-7">
                          {
                            authorsAffiliations.affiliations.map( ( item: any, index: number ) => (
                              <div key={ `affiliation-${ index }` }>
                                  { `${ index + 1 } ${ item }` }
                              </div>
                            ))
                          }
                        </div>
                        <div id="authors-affiliations" className="fs-7">
                          {
                            Object.entries( authorsAffiliations.correspondings ).map( ([ key, value ]) => (
                              <span key={ `corresponding-${ key }` }>
                                  { `${ key } ${ value }` }
                              </span>
                            ))
                          }
                        </div>
                      </div>
                  }
              </div>
        }
      </>
    );
});

AuthorsStep.displayName = 'AuthorsStep';

export default AuthorsStep;