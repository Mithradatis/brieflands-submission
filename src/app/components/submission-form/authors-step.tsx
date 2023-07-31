import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Alert } from '@mui/material'
import { Input } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { stepState } from '@/app/features/submission/authorSlice'
import { handleOpen } from '@/app/features/modal/modalSlice'
import { handleDialogOpen } from '@/app/features/dialog/dialogSlice'
import { getAuthorStepData, getAuthorStepGuide, loadEditAuthorForm } from '@/app/api/author'
import DataTable, { TableColumn } from 'react-data-table-component'
import ReactHtmlParser from 'react-html-parser'

const FilterComponent = ({ filterText, onFilter, onClear }: { filterText: string, onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void, onClear: () => void }) => (
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

const AuthorsStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [filteredItems, setFilteredItems] = useState([]);
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/authors`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'authors' ) {
            dispatch( getAuthorStepData( getStepDataFromApi ) );
            dispatch( getAuthorStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {}
    }));
    const deleteAuthorUrl = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }/remove`;
    const columns: TableColumn<{ email: string; firstname: string; lastname: string; actions: any; }>[] = [  
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
            name: 'Actions',
            cell: ( row ) => (
              <div className="d-flex align-items-center justify-content-center flex-wrap">
                <Button
                  className="me-2 py-2"  
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ minWidth: 0 }}
                  onClick={ () => dispatch( loadEditAuthorForm( row.email ) ) }
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
                        action: deleteAuthorUrl, 
                        data: row.email, 
                        dialogTitle: 'Delete Author', 
                        dialogContent: 'Are you sure?', 
                        dialogAction: 'delete-author' } 
                        ) ) 
                    }
                >
                  <i className="fa-duotone fa-trash"></i>
                </Button>
              </div>
            ),
        },
    ];
    const [filterText, setFilterText] = useState('');
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
            filterText={filterText}
            onFilter={ event => setFilterText(event.target.value)}
            onClear={ handleClear }
        />
      );
    }, [filterText, resetPaginationToggle]);
    useEffect(() => {
      if ( wizard.formStep === 'authors' ) {
        const filteredData = formState.authorsList.filter( ( item: any ) => {
          const rowValues = Object.values( item );
          return rowValues.some((value) => {
            if (typeof value === 'string') {
              const formattedValue = value.replace(/\s/g, '').toLowerCase();
              const formattedFilterText = filterText.replace(/\s/g, '').toLowerCase().trim();
              return formattedValue.includes(formattedFilterText);
            }
            return false;
          });
        });
        setFilteredItems( filteredData );
      }
    }, [formState.authorsList, filterText, wizard.formStep]);

    return (
        <>
            <div id="authors" className={`tab${wizard.formStep === 'authors' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Authors</h3>
                <Scrollbars
                    className="mb-4"
                    style={{ width: 500, height: 200 }}
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
                <Button className="btn btn-primary btn-lg mb-4" onClick={() => dispatch( handleOpen( { title: 'Add an Author', parent: wizard.formStep } ) )}>
                    Add Author
                </Button>
                {
                    formState.authorsList.length > 0 &&
                      <div className="datatable-container">
                          <DataTable
                              title={<h4 className="fs-6 mb-0">Authors List</h4>}
                              subHeader
                              subHeaderComponent={subHeaderComponentMemo}
                              persistTableHead
                              pagination
                              columns={columns}
                              data={filteredItems}
                          />
                      </div>
                }
            </div>
        </>
    );
});

AuthorsStep.displayName = 'AuthorsStep';

export default AuthorsStep;