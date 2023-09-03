import { useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Alert, Skeleton } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleLoading } from '@/app/features/submission/authorSlice'
import { handleOpen } from '@/app/features/modal/modalSlice'
import { handleDialogOpen } from '@/app/features/dialog/dialogSlice'
import { getAuthorStepData, getAuthorStepGuide, loadEditAuthorForm, updateAuthorsOrder, getAllCountries, getAuthorsAffiliations } from '@/app/api/author'
import ReactHtmlParser from 'react-html-parser'
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table'

const AuthorsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const filteredItems = formState.authorsList;
    const wizard = useSelector( wizardState );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/authors`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    const getAllCountriesUrl = `${ wizard.baseUrl }/api/v1/journal/country?page[size]=1000`;
    const getAuthorsAffiliationsFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/authors/affiliations`;
    useEffect(() => {
        dispatch( getAuthorStepData( getStepDataFromApi ) );
        dispatch( getAuthorStepGuide( getDictionaryFromApi ) );
        dispatch( getAllCountries( getAllCountriesUrl ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useEffect( () => {
      dispatch( getAuthorsAffiliations( getAuthorsAffiliationsFromApi ) );
    }, [formState.authorsList]);
    useImperativeHandle(ref, () => ({
      async submitForm () {
        dispatch( handleLoading( true ) );
        let isAllowed = true;  
        
        return isAllowed;
      }
    }));
    const deleteAuthorUrl = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }/remove`;
    const updateAuthorsOrderUrl = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }/change_order`;
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
            </Box>
          ),
        },
    ], []);

    return (
        <>
          <div className={ `step-loader ${ formState.isLoading ? ' d-block' : ' d-none' }` }>
              <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
              <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
              <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
          </div>
          <div id="authors" className={ `tab ${ formState.isLoading ? ' d-none' : ' d-block' }` }>
              <h3 className="mb-4 text-shadow-white">Authors</h3>
              {
                  ( details !== undefined && details !== '' ) &&
                      <Alert severity="error" className="mb-4">
                          { ReactHtmlParser( details ) }
                      </Alert>
              }
              <Scrollbars
                  className="mb-4"
                  style={{ width: 600, height: 200 }}
                  universal={true}
                  autoHide
                  autoHideTimeout={500}
                  autoHideDuration={200}>
                  {
                    formState?.stepGuide !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                  }
              </Scrollbars>
              {
                wizard.workflow?.storage?.revision === undefined && 
                  <Button className="btn btn-primary btn-lg mb-4" onClick={() => {
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
                Object.keys( formState.authorsAffiliations ).length > 0 &&
                  <div id="affiliations">
                    <div id="authors-list">
                      {
                        formState.authorsAffiliations.names.map( ( item: any, index: number ) => (
                          <span key={ `author-${ index }` }>
                            <span className="fw-bold text-muted">
                              { `${ item.first_name }${ item.middl_ename || '' } ${ item.last_name }` }
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