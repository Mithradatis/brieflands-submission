import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useMemo, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Box, Button, Alert } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { formValidator } from '@features/wizard/wizardSlice'
import { handleOpen } from '@features/modal/modalSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table'
import { AuthorsListItem, handleLoading } from '@features/submission/steps/authors/authorsSlice'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import {
  useGetAuthorsAffiliationsQuery, 
  createAuthorsTable,
  loadEditAuthorForm, 
  updateAuthorsOrder,
  handleCloseAuthorModal 
} from '@/app/services/steps/authors'

const AuthorsStep = forwardRef(
  ( 
      props: { 
          apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
          details: string,
          workflowId: string
      }, 
      ref 
  ) => {
    const [ formData, setFormData ] = useState<AuthorsListItem[]>();
    const [ filteredItems, setFilteredItems ] = useState<object[]>();
    const dispatch = useAppDispatch();
    const isRevision = useAppSelector( ( state: any ) => state.wizard.isRevision );
    const formStep = useAppSelector( ( state: any ) => state.wizard.formStep );
    const modal = useAppSelector( ( state: any ) => state.modal );
    const { data: authorsAffiliations, isLoading: authorsAffiliationsIsLoading } = useGetAuthorsAffiliationsQuery( props.workflowId );
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( authorsAffiliationsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const getAuthorsAffiliationsFromApi = `${ process.env.SUBMISSION_API_URL }/${ props.workflowId }/authors/affiliations`;
    useEffect(() => {
      if ( stepData ) {
        setFormData( stepData );
        setFilteredItems( createAuthorsTable( stepData ) );
      }
    }, [stepData]);
    useEffect(() => {
        dispatch( formValidator( true ) );
    }, []);
    useEffect( () => {
      if ( !modal.modalOpen ) {
        dispatch( handleCloseAuthorModal() );
      }
    }, [modal.modalOpen]);
    useImperativeHandle(ref, () => ({
      async submitForm () {
        dispatch( handleLoading( true ) );
        let isAllowed = true;  
        
        return isAllowed;
      }
    }));
    type Author = {
      email: string;
      firstname: string;
      lastname: string;
      orcid: string;
      iscorresponding: string;
    };
    const columns = useMemo<MRT_ColumnDef<Author>[]>(
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
                onClick={() => dispatch( loadEditAuthorForm( row.original.email ) ) }>
                <i className="fa-duotone fa-edit"></i>
              </Button>
              {
                !isRevision &&
                  <Button 
                    key="delete"
                    className="py-2"
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ minWidth: 0 }}
                    onClick={() => dispatch( handleDialogOpen( 
                    { 
                        actions: { deleteAuthor: `${ props.apiUrls.stepDataApiUrl }/remove` },
                        data: row.original.email,
                        dialogTitle: 'Delete Author', 
                        dialogContent: { content: 'Are you sure?' }, 
                        dialogAction: 'delete-author' } 
                        ) ) 
                    }>
                    <i className="fa-duotone fa-trash"></i>
                  </Button>
              }
            </Box>
          ),
        },
    ], []);

    return (
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
                      dispatch( handleOpen( { title: 'Add an Author', parent: formStep } ) )}
                    }>
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
                                const itemsCopy = filteredItems.slice();
                                itemsCopy.splice(
                                  hoveredRow.id,
                                  0,
                                  itemsCopy.splice(draggingRow.index, 1)[0]
                                );
                                dispatch( updateAuthorsOrder(
                                  { 
                                    url: `${ props.apiUrls.stepDataApiUrl }/change_order`, 
                                    authors: itemsCopy 
                                  }
                                ) );
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
    );
});

AuthorsStep.displayName = 'AuthorsStep';

export default AuthorsStep;