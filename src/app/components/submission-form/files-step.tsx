import { useState, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react'
import { Alert, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {  Autocomplete, FormHelperText, Input, FormLabel, FormControl } from '@mui/joy'
import { useDropzone } from 'react-dropzone'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput, handleDropzoneStatus } from '@/app/features/submission/documentFilesSlice'
import { getFileTypes, getFilesStepData, getFilesStepGuide, updateFilesStepData, addFile } from '@/app/api/files'
import { handleDialogOpen } from '@/app/features/dialog/dialogSlice'
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

const FilesStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( stepState );
    const fileTypes = formState.fileTypesList;
    const wizard = useSelector( wizardState );
    const [filteredItems, setFilteredItems] = useState([]);
    const getFileTypesFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/files/get_file_types`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/files`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    useEffect(() => {
        if ( wizard.formStep === 'files' ) {
            dispatch( getFileTypes( getFileTypesFromApi ) );
            dispatch( getFilesStepData( getStepDataFromApi ) );
            dispatch( getFilesStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'files' ) {
            const formIsValid = Object.values( formState.value ).every(value => value !== '');
            dispatch( formValidator( formIsValid ) );
        }
    }, [formState?.value, wizard.formStep, wizard.workflow]);
    useEffect(() => {
        if ( wizard.formStep === 'files' ) {
          const filteredData = formState.newFilesList.filter( ( item: any ) => {
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
    }, [formState.newFilesList, filterText, wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {}
    }));
    const deleteFileUrl = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }/remove`;
    const columns: TableColumn<{ 
        fileName: string, 
        fileType: string, 
        caption: string,
        fileSize: string,
        wordCount: string,
        uploadDate: string,
        uuid: string,
        downloadLink: string 
        actions: any }>[] = [  
        {
            name: 'File Name',
            selector: row => row.fileName,
            sortable: true,
            reorder: true
        },
        {
            name: 'File Type',
            selector: row => row.fileType,
            sortable: true,
            reorder: true
        },
        {
            name: 'Caption',
            selector: row => row.caption,
            sortable: true,
            reorder: true
        },
        {
            name: 'File Size',
            selector: row => {
                const fileSizeInKB:any = ( parseInt( row.fileSize ) / 1024 ).toFixed( 2 );
                const fileSizeInMB: any = ( parseInt( fileSizeInKB ) / 1024 ).toFixed( 2 );
        
                if ( fileSizeInMB >= 1 ) {
                  return `${ fileSizeInMB } MB`;
                } else {
                  return `${ fileSizeInKB } KB`;
                }
            },
            sortable: true,
            reorder: true
        },
        {
            name: 'Word Count',
            selector: row => row.wordCount,
            sortable: true,
            reorder: true
        },
        {
            name: 'Upload Date',
            selector: row => row.uploadDate,
            sortable: true,
            reorder: true
        },
        {
            name: 'Actions',
            cell: ( row ) => (
                <div className="d-flex align-items-center justify-content-center flex-wrap">
                    <Button
                        className="py-2 me-2"
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ minWidth: 0 }}
                        onClick={ () => dispatch( handleDialogOpen( 
                            { 
                                action: deleteFileUrl, 
                                data: row.uuid, 
                                dialogTitle: 'Delete File', 
                                dialogContent: 'Are you sure?', 
                                dialogAction: 'delete-file' } 
                                ) ) 
                            }
                        >
                        <i className="fa-duotone fa-trash"></i>
                    </Button>
                    <a href={ `/cdn/dl/${ row.uuid }` }>
                        <Button
                            className="py-2"
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ minWidth: 0 }}
                        >
                            <i className="fa-duotone fa-download"></i>
                        </Button>
                    </a>
                </div>
            ),
        },
    ];
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
    const [isDragActive, setIsDragActive] = useState(false);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        multiple: false,
        disabled: formState.formStatus.isDisabled,
        onDragEnter: () => setIsDragActive( true ),
        onDragLeave: () => { 
            dispatch( handleDropzoneStatus( formState.value.file_type_id !== undefined && formState.value.file_type_id !== '' ) ); 
            setIsDragActive( false )
        },
        onDropAccepted: ( droppedFiles ) => {
            droppedFiles.forEach( ( file ) => {
                dispatch( addFile( file ) );
            });
        },
    });

    return (
        <>
            <div id="files" className={`tab${wizard.formStep === 'files' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Files</h3>
                {   
                    formState.stepGuide !== undefined &&  
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                }
                <FormControl className="mb-3" error={ !formState.formStatus.fileTypeId && formState.formStatus.isDisabled }>
                    <FormLabel className="fw-bold mb-1">
                        File Type
                    </FormLabel>
                    { fileTypes ? (
                        <Autocomplete
                            required
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="fileType"
                            id="fileType"
                            options={ 
                                Array.isArray( fileTypes ) 
                                ? fileTypes.map( 
                                    item => {
                                        return item.attributes?.title || '' 
                                    }
                                   ) : []
                            }
                            value={
                                formState.value.file_type_id !== ''
                                  ? fileTypes
                                      .find( ( item: any ) => formState.value.file_type_id === item.id )?.attributes?.title
                                  : null
                            }
                            onChange={(event, value) => {
                                if ( value === '' ) {
                                    dispatch( handleDropzoneStatus( false ) );
                                }
                                dispatch( handleInput({
                                    name: 'file_type_id',
                                    value: fileTypes.find( 
                                        ( item: any ) => item.attributes.title === value )?.id || '' } 
                                        ) 
                                    )
                            }}
                        />
                        ) : (
                        <div>Loading document types...</div>
                    )}
                    {
                        ( !formState.formStatus.fileTypeId && formState.formStatus.isDisabled )
                        && <FormHelperText className="fs-7 text-danger mt-1">Please select the file type first</FormHelperText> 
                    }
                </FormControl>
                <div className={`dropzone d-flex align-items-center justify-content-center p-4 mb-4 ${ isDragActive ? 'drag-active' : ''}`}
                    { ...getRootProps() }>
                    <input { ...getInputProps() } />
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <i className='d-block fa-duotone fa-file-text text-warning'></i>
                        <p className="fs-7 text-muted mb-2">Drag and Drop your Your File Here</p>
                        <Button variant="contained" color="primary" 
                            onClick={ () => {
                                dispatch( handleDropzoneStatus( formState.value.file_type_id !== undefined && formState.value.file_type_id !== '' ) ); 
                            }}>
                            Select File
                        </Button>
                    </div>
                </div>
                {
                    formState.oldFilesList.length > 0 &&
                    <div className="datatable-container">
                        <DataTable
                        className="datatable"
                            title={ <h4 className="fs-6 mb-0 px-0">Files List</h4> }
                            subHeader
                            subHeaderComponent={ subHeaderComponentMemo }
                            persistTableHead
                            pagination
                            columns={ columns }
                            data={ filteredItems }
                        />
                    </div> 
                }
                <hr/>
                {
                    formState.newFilesList.length > 0 &&
                    <div className="datatable-container">
                        <DataTable
                            className="datatable"
                            title={ <h4 className="fs-6 mb-0 px-0">Files List</h4> }
                            subHeader
                            subHeaderComponent={ subHeaderComponentMemo }
                            persistTableHead
                            pagination
                            columns={ columns }
                            data={ filteredItems }
                        />
                    </div> 
                }
            </div>
        </>
    );
});

FilesStep.displayName = 'FilesStep';

export default FilesStep;