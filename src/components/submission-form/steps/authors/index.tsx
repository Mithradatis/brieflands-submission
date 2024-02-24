import ReactHtmlParser from 'react-html-parser'
import { useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Alert, Skeleton } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { formValidator } from '@/lib/features/wizard/wizardSlice'
import { handleLoading } from '@/lib/features/submission/steps/authors/authorsSlice'
import { handleOpen } from '@/lib/features/modal/modalSlice'
import { handleDialogOpen } from '@/lib/features/dialog/dialogSlice'
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table'
import {
  getAuthorStepData, 
  getAuthorStepGuide, 
  loadEditAuthorForm, 
  updateAuthorsOrder, 
  getAllCountries, 
  getAuthorsAffiliations, 
  handleCloseAuthorModal 
} from '@/lib/api/steps/authors'

const AuthorsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.authorsSlice );
    const filteredItems = formState.authorsList;
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const modal = useSelector( ( state: any ) => state.modalSlice );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/authors`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    const getAllCountriesUrl = `${ process.env.API_URL }/journal/country?page[size]=1000`;
    const getAuthorsAffiliationsFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/authors/affiliations`;
    useEffect(() => {
      if ( wizard.formStep === 'authors' ) {
        dispatch( getAuthorStepData( getStepDataFromApi ) );
        dispatch( getAuthorStepGuide( getDictionaryFromApi ) );
        dispatch( getAllCountries( getAllCountriesUrl ) );
        dispatch( formValidator( true ) );
      }
    }, []);
    useEffect( () => {
      dispatch( getAuthorsAffiliations( getAuthorsAffiliationsFromApi ) );
    }, [formState.authorsList]);
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
    const deleteAuthorUrl = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }/remove`;
    const updateAuthorsOrderUrl = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }/change_order`;
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
                !wizard.isRevision &&
                  <Button 
                    key="delete"
                    className="py-2"
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ minWidth: 0 }}
                    onClick={() => dispatch( handleDialogOpen( 
                    { 
                        actions: { deleteAuthor: deleteAuthorUrl }, 
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
        <>
          <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
              <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
              <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
              <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
          </div>
          <div id="authors" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
              <h3 className="mb-4 text-shadow-white">Authors</h3>
              {
                  ( details !== undefined && details !== '' ) &&
                      <Alert severity="error" className="mb-4">
                          { ReactHtmlParser( details ) }
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
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' &&
                      <Alert severity="info" className="mb-4">
                          { ReactHtmlParser( formState.stepGuide ) }
                      </Alert>
                  }
              </Scrollbars>
              {
                !wizard.isRevision && 
                  <Button className="btn btn-primary btn-lg mb-0" onClick={() => {
                    dispatch( handleOpen( { title: 'Add an Author', parent: wizard.formStep } ) )}
                  }>
                    Add Author
                  </Button>
              }
              {
                formState.authorsList.length > 0 &&
                  <div className="datatable-container">
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
                        muiTableBodyRowDragHandleProps={({ table }) => ({
                          onDragEnd: () => {
                            const { draggingRow, hoveredRow } = table.getState();
                            if ( hoveredRow && draggingRow ) {
                              const itemsCopy = filteredItems.slice();
                              itemsCopy.splice(
                                hoveredRow.id,
                                0,
                                itemsCopy.splice(draggingRow.index, 1)[0]
                              );
                              dispatch(updateAuthorsOrder({ url: updateAuthorsOrderUrl, authors: itemsCopy }));
                            }
                          },
                        })}
                      />
                  </div>
              }
              {
                ( formState.authorsAffiliations !== undefined && Object.keys( formState.authorsAffiliations ).length > 0 ) &&
                  <div id="affiliations">
                    <div id="authors-list">
                      {
                        formState.authorsAffiliations.names.map( ( item: any, index: number ) => (
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
                        formState.authorsAffiliations.affiliations.map( ( item: any, index: number ) => (
                          <div key={ `affiliation-${ index }` }>
                              { `${ index + 1 } ${ item }` }
                          </div>
                        ))
                      }
                    </div>
                    <div id="authors-affiliations" className="fs-7">
                      {
                        Object.entries( formState.authorsAffiliations.correspondings ).map( ([ key, value ]) => (
                          <span key={ `corresponding-${ key }` }>
                              { `${ key } ${ value }` }
                          </span>
                        ))
                      }
                    </div>
                  </div>
              }
          </div>
        </>
    );
});

AuthorsStep.displayName = 'AuthorsStep';

export default AuthorsStep;