import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Alert } from '@mui/material'
import { Input } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { stepState } from '@/app/features/submission/authorSlice'
import { handleOpen } from '@/app/features/modal/modalSlice'
import { handleDialogOpen } from '@/app/features/dialog/dialogSlice'
import { getAuthorStepData, getAuthorStepGuide, loadEditAuthorForm, updateAuthorsOrder } from '@/app/api/author'
import ReactHtmlParser from 'react-html-parser'
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table'

const AuthorsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const filteredItems = formState.authorsList;
    const wizard = useSelector( wizardState );
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/authors`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        dispatch( getAuthorStepData( getStepDataFromApi ) );
        dispatch( getAuthorStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          return true;
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
                    action: deleteAuthorUrl, 
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
          <div id="authors" className="tab">
              <h3 className="mb-4 text-shadow-white">Authors</h3>
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
                wizard.documentId === '' &&
                  <Button className="btn btn-primary btn-lg mb-4" onClick={() => dispatch( handleOpen( { title: 'Add an Author', parent: wizard.formStep } ) )}>
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
          </div>
        </>
    );
});

AuthorsStep.displayName = 'AuthorsStep';

export default AuthorsStep;