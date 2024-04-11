import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import useMessageHandler from '@/app/services/messages'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react'
import { Alert, Button } from '@mui/material'
import { useAppDispatch } from '@/app/store'
import {  Autocomplete, FormHelperText, Input, FormLabel, FormControl } from '@mui/joy'
import { useDropzone } from 'react-dropzone'
import { formValidator } from '@features/wizard/wizardSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { type File } from '@/app/services/types/file'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import { 
    useGetFileTypesQuery, 
    useAddFileMutation,
    createFileTable 
} from '@/app/services/steps/files'
const FilterComponent = (
    { filterText, onFilter, onClear }: { 
        filterText: string, 
        onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void, 
        onClear: () => void 
    }) => (
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

const FilesStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string,
            workflowId: string 
        }, 
        ref 
    ) => {
    const { messageHandler } = useMessageHandler();
    const dispatch = useAppDispatch();
    const [newFilteredItems, setNewFilteredItems] = useState<File[]>();
    const [oldFilteredItems, setOldFilteredItems] = useState<File[]>();
    const [filterText, setFilterText] = useState<string>('');
    const [ caption, setCaption ] = useState({
        caption: true
    });
    const [ formData, setFormData ] = useState({
        caption: '',
        captionRequired: false,
        file_type_id: '',
        formStatus: {
            isDisabled: true,
            fileTypeId: true
        },
        oldFiles: [],
        newFiles: []
    });
    const getFileTypesFromApi = 
                `${ process.env.SUBMISSION_API_URL }/${ props.workflowId }/files/get_file_types`;
    const { data: fileTypes, isLoading: fileTypesIsLoading } = useGetFileTypesQuery( getFileTypesFromApi );
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const [ addFileTrigger ] = useAddFileMutation();
    const isLoading: boolean = ( fileTypesIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    useEffect(() => {
        setCaption( prevState => ({
            ...prevState,
            caption: formData?.caption !== undefined && formData?.caption !== '',
        }));
    }, [formData]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    useEffect(() => {
        dispatch( formValidator( true ) );
    }, []);
    let filesTable: any;
    useEffect( () => {
        if ( stepData ) {
            filesTable = createFileTable( stepData.old_files, stepData.new_files );
            setFormData( prevState => ({
                ...prevState,
                oldFiles: filesTable.oldFiles,
                newFiles: filesTable.newFiles
            }));
        }
    }, [stepData]);
    useEffect(() => {
        const newfilteredData = formData.newFiles?.filter( ( item: any ) => {
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
        setNewFilteredItems( newfilteredData );
    }, [formData.newFiles, filterText]);
    useEffect(() => {
        const oldfilteredData = formData.oldFiles?.filter( ( item: any ) => {
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
        setOldFilteredItems( oldfilteredData );
    }, [formData.oldFiles, filterText]);
    useImperativeHandle(ref, () => ({
        async submitForm () { 
          let isAllowed = true;

          return isAllowed;
        }
    }));
    const deleteFileUrl = 
        `${ process.env.SUBMISSION_API_URL }/${ props.workflowId }/files/remove`;
    const newColumns: TableColumn<{
        id: number,
        fileName: string, 
        fileType: string, 
        caption: string,
        fileSize: string,
        wordCount: string,
        uploadDate: string,
        uuid: string,
        reuse: boolean,
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
                                actions: { deleteFile: deleteFileUrl }, 
                                data: row.uuid, 
                                dialogTitle: 'Delete File', 
                                dialogContent: { content: 'Are you sure?' }, 
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
    const reuseFileUrl = 
        `${ process.env.SUBMISSION_API_URL }/${ props.workflowId }/files/reuse`;
    const oldColumns: TableColumn<{ 
        fileName: string, 
        fileType: string, 
        caption: string,
        fileSize: string,
        wordCount: string,
        uploadDate: string,
        uuid: string,
        reuse: boolean,
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
                    {   
                        row.reuse &&
                            <Button
                                title="Reuse"
                                className="py-2 me-2"
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{ minWidth: 0 }}
                                onClick={ () => dispatch( handleDialogOpen( 
                                    { 
                                        actions: { reuseFile: reuseFileUrl }, 
                                        data: row.uuid, 
                                        dialogTitle: 'Reuse File', 
                                        dialogContent: { content: 'Are you sure?' }, 
                                        dialogAction: 'reuse-file' } 
                                        ) ) 
                                    }
                                >
                                <i className="fa-duotone fa-repeat"></i>
                            </Button>
                    }
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
            filterText={ filterText }
            onFilter={ event => setFilterText( event.target.value ) }
            onClear={ handleClear }
        />
      );
    }, [filterText, resetPaginationToggle]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [ selectedFileType, setSelectedFileType ] = useState('');
    useEffect( () => {
        const selectedType = fileTypes?.find( ( item: any ) =>  (
            parseInt ( item.id ) ===  parseInt( formData?.file_type_id )
        ));
        setSelectedFileType( selectedType?.attributes?.title || '' );
    }, [formData?.file_type_id]);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        multiple: false,
        disabled: formData.formStatus.isDisabled || 
            ( 
                formData.captionRequired && 
                formData.caption === '' 
            ),
        onDragEnter: () => setIsDragActive( true ),
        onDragLeave: () => {
            setFormData( ( prevState: any ) => ({
                ...prevState,
                formStatus: {
                    isDisabled: formData?.file_type_id === undefined || formData?.file_type_id === '',
                    fileTypeId: formData?.file_type_id !== undefined && formData?.file_type_id !== ''
                }
            }));
            setIsDragActive( false )
        },
        onDropAccepted: ( droppedFiles ) => {
            droppedFiles.forEach( ( file ) => {
                addFileTrigger( { 
                    workflowId: props.workflowId, 
                    data: {
                        file_type_id: formData.file_type_id,
                        caption: formData.caption,
                        file: file
                    }
                }).then( ( response: any ) => {
                    messageHandler( 
                        response, { 
                            errorMessage: 'Failed to add file', 
                            successMessage: 'File uploaded successfuly' 
                        } 
                    );
                });
            });
        },
    });

    return (
        isLoading
            ? <StepPlaceholder/>
            : 
                <div id="files" className="tab">
                    <h3 className="mb-4 text-shadow-white">Files</h3>
                    {
                        ( props.details !== undefined && props.details !== '' ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
                            </Alert>
                        )
                    }
                    <FormControl
                        className="mb-3 required" 
                        error={ 
                            !formData.formStatus.fileTypeId && 
                            formData.formStatus.isDisabled 
                        }
                    >
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
                                    ( 
                                        fileTypes && 
                                        Array.isArray( fileTypes ) 
                                    ) 
                                        ? fileTypes.map( 
                                            item => {
                                                return `${ 
                                                    item.attributes?.title
                                                }${ 
                                                    item.attributes?.minimum_requirement > 0 ? ' *' : ''
                                                }` || ''
                                            }
                                        ) 
                                        : []
                                }
                                value={ selectedFileType || '' }
                                onChange={ ( event, value ) => {
                                    setSelectedFileType( value || '' );
                                    setFormData( ( prevState: any ) =>  ({
                                        ...prevState,
                                        captionRequired: fileTypes.find( 
                                            ( item: any ) => 
                                                item.attributes.title === value 
                                                    || `${ 
                                                            item.attributes.title 
                                                        } *` === value )?.attributes.require_caption 
                                                    || '',
                                        file_type_id: fileTypes.find( 
                                            ( item: any ) => 
                                                item.attributes.title === value 
                                                || `${ item.attributes.title } *` === value 
                                        )?.id || '',       
                                        formStatus: {
                                            isDisabled: value === '',
                                            fileTypeId: value !== ''
                                        }         
                                    }))
                                }}
                            />
                            ) : (
                            <div className="text-danger">
                                You have to choose a document type first!
                            </div>
                        )}
                        {
                            ( 
                                !formData.formStatus.fileTypeId && 
                                formData.formStatus.isDisabled 
                            )
                            && <FormHelperText className="fs-7 text-danger mt-1">
                                    Please select the file type first
                                </FormHelperText>
                        }
                    </FormControl>
                    <FormControl 
                        className={`required mb-3 ${ formData.captionRequired ? ' d-block' : ' d-none' }`} 
                        error={ formData.captionRequired && !caption['caption'] }
                    >
                        <FormLabel className="fw-bold mb-1">
                            Caption
                        </FormLabel>
                        <Input
                            required={ formData.captionRequired }
                            variant="soft"
                            name="fileCaption"
                            id="fileCaption"
                            placeholder="Write a caption"
                            value={ formData?.caption || '' }
                            onChange={ event =>
                                setFormData( ( prevState: any ) => ({
                                    ...prevState,
                                    caption: event.target.value || ''
                                }))
                            }
                        />
                        {
                            ( 
                                formData.captionRequired && 
                                formData.caption === '' 
                            ) 
                            && <FormHelperText className="fs-7 text-danger mt-1">
                                    Caption is required
                               </FormHelperText>
                        }
                    </FormControl>
                    <div 
                        className={`dropzone d-flex align-items-center justify-content-center p-4 mb-4 ${ 
                            isDragActive 
                                ? 'drag-active' 
                                : ''
                            }`
                        }
                        { ...getRootProps() }
                    >
                        <input { ...getInputProps() } />
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <i className='d-block fa-duotone fa-file-text text-warning'></i>
                            <p className="fs-7 text-muted mb-2">
                                Drag and Drop your Your File Here
                            </p>
                            <Button variant="contained" color="primary" 
                                onClick={ () => {
                                    setFormData( ( prevState: any ) => ({
                                        ...prevState,
                                        formStatus: {
                                            isDisabled: formData?.file_type_id === undefined || formData?.file_type_id === '',
                                            fileTypeId: formData?.file_type_id !== undefined && formData?.file_type_id !== ''
                                        }
                                    }))
                                }}>
                                Select File
                            </Button>
                        </div>
                    </div>
                    <div className="datatable-container">
                        <DataTable
                            className="datatable"
                            title={ <h4 className="fs-6 mb-0 px-0">Files</h4> }
                            subHeader
                            subHeaderComponent={ subHeaderComponentMemo }
                            persistTableHead
                            pagination
                            columns={ newColumns }
                            data={ newFilteredItems || [] }
                        />
                    </div>
                    <hr/> 
                    {
                        formData.oldFiles?.length > 0 &&
                            <div className="datatable-container">
                                <DataTable
                                    className="datatable"
                                    title={ <h4 className="fs-6 mb-0 px-0">Old Files</h4> }
                                    subHeader
                                    subHeaderComponent={ subHeaderComponentMemo }
                                    persistTableHead
                                    pagination
                                    columns={ oldColumns }
                                    data={ oldFilteredItems || [] }
                                />
                            </div> 
                    }
                </div>
    );
});

FilesStep.displayName = 'FilesStep';

export default FilesStep;