import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import useMessageHandler from '@/app/hooks/messages'
import { DataGrid, type GridRowsProp, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react'
import { useAppDispatch } from '@/store/store'
import { useDropzone } from 'react-dropzone'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileText, faDownload, faTrash, faRepeat, faRemove } from '@fortawesome/pro-duotone-svg-icons'
import { type File } from '@/app/services/types/file'
import { useGetStepDataQuery, useGetStepGuideQuery } from '@/app/services/apiSlice'
import {
    useGetFileTypesQuery,
    useAddFileMutation,
    createFileTable
} from '@/app/services/steps/files'
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Divider,
    FormHelperText,
    FormLabel,
    FormControl,
    InputAdornment,

    Link,
    Stack,
    TextField,
    Typography
} from '@mui/material'
const FilterComponent = (
    { filterText, onFilter, onClear }: {
        filterText: string,
        onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void,
        onClear: () => void
    }) => (
    <>
        <TextField
            variant="filled"
            size="small"
            placeholder="Filter By Name"
            aria-label="Search Input"
            autoComplete="off"
            onChange={onFilter}
            InputProps={{
                startAdornment:
                    <InputAdornment position="start">
                        <FontAwesomeIcon icon={faRemove} onClick={onClear} />
                    </InputAdornment>
            }}
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
        const [newFilteredItems, setNewFilteredItems] = useState<any[]>();
        const [oldFilteredItems, setOldFilteredItems] = useState<any[]>();
        const [filterText, setFilterText] = useState<string>('');
        const [caption, setCaption] = useState({
            caption: true
        });
        const [formData, setFormData] = useState({
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
            `${process.env.SUBMISSION_API_URL}/${props.workflowId}/files/get_file_types`;
        const {
            data: fileTypes,
            isLoading: fileTypesIsLoading
        } = useGetFileTypesQuery(getFileTypesFromApi);
        const {
            data: stepGuide,
            isLoading: stepGuideIsLoading
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepData,
            isLoading: stepDataIsLoading
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const [addFileTrigger] = useAddFileMutation();
        const isLoading: boolean = (
            fileTypesIsLoading ||
            stepGuideIsLoading ||
            stepDataIsLoading ||
            typeof stepGuide !== 'string'
        );
        useEffect(() => {
            setCaption(prevState => ({
                ...prevState,
                caption: formData?.caption !== undefined && formData?.caption !== '',
            }));
        }, [formData]);
        const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        let filesTable: any;
        useEffect(() => {
            if (stepData) {
                filesTable = createFileTable(stepData.old_files, stepData.new_files);
                setFormData(prevState => ({
                    ...prevState,
                    oldFiles: filesTable.oldFiles,
                    newFiles: filesTable.newFiles
                }));
            }
        }, [stepData]);
        useEffect(() => {
            const newfilteredData = formData.newFiles?.filter((item: any) => {
                const rowValues = Object.values(item);
                return rowValues.some((value) => {
                    if (typeof value === 'string') {
                        const formattedValue = value.replace(/\s/g, '').toLowerCase();
                        const formattedFilterText = filterText.replace(/\s/g, '').toLowerCase().trim();
                        return formattedValue.includes(formattedFilterText);
                    }
                    return false;
                });
            });
            setNewFilteredItems(newfilteredData);
        }, [formData.newFiles, filterText]);
        useEffect(() => {
            const oldfilteredData = formData.oldFiles?.filter((item: any) => {
                const rowValues = Object.values(item);
                return rowValues.some((value) => {
                    if (typeof value === 'string') {
                        const formattedValue = value.replace(/\s/g, '').toLowerCase();
                        const formattedFilterText = filterText.replace(/\s/g, '').toLowerCase().trim();
                        return formattedValue.includes(formattedFilterText);
                    }
                    return false;
                });
            });
            setOldFilteredItems(oldfilteredData);
        }, [formData.oldFiles, filterText]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = true;

                return isAllowed;
            }
        }));
        const deleteFileUrl =
            `${process.env.SUBMISSION_API_URL}/${props.workflowId}/files/remove`;
        const newColumns: GridColDef<(typeof newFilteredItems)[]>[] = [
            {
                field: 'fileName',
                headerName: 'File Name',
                width: 150
            },
            {
                field: 'fileType',
                headerName: 'File Type',
                width: 150

            },
            {
                field: 'caption',
                headerName: 'Caption',
                width: 80
            },
            {
                field: 'fileSize',
                headerName: 'File Size',
                width: 80,
                valueFormatter: (value: number) => {
                    const fileSizeInKB: number = parseInt((value / 1024).toFixed(2));
                    const fileSizeInMB: number = parseInt((fileSizeInKB / 1024).toFixed(2));
                    if (fileSizeInMB >= 1) {
                        return `${fileSizeInMB} MB`;
                    } else {
                        return `${fileSizeInKB} KB`;
                    }
                }
            },
            {
                field: 'wordCount',
                headerName: 'Word Count',
                width: 80,
                type: 'number',
                align: 'left'
            },
            {
                field: 'uploadDate',
                headerName: 'Upload Date',
                width: 105
            },
            {
                field: 'actions',
                headerName: 'Actions',
                align: 'left',
                renderCell: (params: any) => (
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        justifyContent="start"
                    >
                        <GridActionsCellItem
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            label="Delete"
                            onClick={
                                () => dispatch(handleDialogOpen(
                                    {
                                        actions: { deleteFile: deleteFileUrl },
                                        data: params.row.uuid,
                                        dialogTitle: 'Delete File',
                                        dialogContent: { content: 'Are you sure?' },
                                        dialogAction: 'delete-file'
                                    }
                                ))
                            }
                        />
                        <Link href={`/cdn/dl/${params.row.uuid}`}>
                            <GridActionsCellItem
                                icon={<FontAwesomeIcon icon={faDownload} />}
                                label="Download"
                            />
                        </Link>
                    </Stack>

                ),
            },
            // {
            //     name: 'Actions',
            //     cell: (row) => (
            //         <Box className="d-flex align-items-center justify-content-center flex-wrap">
            //             <Button
            //                 className="py-2 me-2"
            //                 variant="contained"
            //                 color="secondary"
            //                 size="small"
            //                 sx={{ minWidth: 0 }}
            //                 onClick={() => dispatch(handleDialogOpen(
            //                     {
            //                         actions: { deleteFile: deleteFileUrl },
            //                         data: row.uuid,
            //                         dialogTitle: 'Delete File',
            //                         dialogContent: { content: 'Are you sure?' },
            //                         dialogAction: 'delete-file'
            //                     }
            //                 ))
            //                 }
            //             >
            //                 <FontAwesomeIcon icon={faTrash} />
            //             </Button>
            //             <Link href={`/cdn/dl/${row.uuid}`}>
            //                 <Button
            //                     className="py-2"
            //                     variant="contained"
            //                     color="primary"
            //                     size="small"
            //                     sx={{ minWidth: 0 }}
            //                 >
            //                     <FontAwesomeIcon icon={faDownload} />
            //                 </Button>
            //             </Link>
            //         </Box>
            //     ),
            // },
        ];
        const reuseFileUrl =
            `${process.env.SUBMISSION_API_URL}/${props.workflowId}/files/reuse`;
        // const oldColumns = [
        //     {
        //         name: 'File Name',
        //         selector: row => row.fileName,
        //         sortable: true,
        //         reorder: true
        //     },
        //     {
        //         name: 'File Type',
        //         selector: row => row.fileType,
        //         sortable: true,
        //         reorder: true
        //     },
        //     {
        //         name: 'Caption',
        //         selector: row => row.caption,
        //         sortable: true,
        //         reorder: true
        //     },
        //     {
        //         name: 'File Size',
        //         selector: row => {
        //             const fileSizeInKB: any = (parseInt(row.fileSize) / 1024).toFixed(2);
        //             const fileSizeInMB: any = (parseInt(fileSizeInKB) / 1024).toFixed(2);

        //             if (fileSizeInMB >= 1) {
        //                 return `${fileSizeInMB} MB`;
        //             } else {
        //                 return `${fileSizeInKB} KB`;
        //             }
        //         },
        //         sortable: true,
        //         reorder: true
        //     },
        //     {
        //         name: 'Word Count',
        //         selector: row => row.wordCount,
        //         sortable: true,
        //         reorder: true
        //     },
        //     {
        //         name: 'Upload Date',
        //         selector: row => row.uploadDate,
        //         sortable: true,
        //         reorder: true
        //     },
        //     {
        //         name: 'Actions',
        //         cell: (row) => (
        //             <Box className="d-flex align-items-center justify-content-center flex-wrap">
        //                 {
        //                     row.reuse &&
        //                     <Button
        //                         title="Reuse"
        //                         className="py-2 me-2"
        //                         variant="contained"
        //                         color="secondary"
        //                         size="small"
        //                         sx={{ minWidth: 0 }}
        //                         onClick={() => dispatch(handleDialogOpen(
        //                             {
        //                                 actions: { reuseFile: reuseFileUrl },
        //                                 data: row.uuid,
        //                                 dialogTitle: 'Reuse File',
        //                                 dialogContent: { content: 'Are you sure?' },
        //                                 dialogAction: 'reuse-file'
        //                             }
        //                         ))
        //                         }
        //                     >
        //                         <FontAwesomeIcon icon={faRepeat} />
        //                     </Button>
        //                 }
        //                 <Link href={`/cdn/dl/${row.uuid}`}>
        //                     <Button
        //                         className="py-2"
        //                         variant="contained"
        //                         color="primary"
        //                         size="small"
        //                         sx={{ minWidth: 0 }}
        //                     >
        //                         <FontAwesomeIcon icon={faDownload} />
        //                     </Button>
        //                 </Link>
        //             </Box>
        //         ),
        //     },
        // ];
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
                    onFilter={event => setFilterText(event.target.value)}
                    onClear={handleClear}
                />
            );
        }, [filterText, resetPaginationToggle]);
        const [isDragActive, setIsDragActive] = useState(false);
        const [selectedFileType, setSelectedFileType] = useState('');
        useEffect(() => {
            const selectedType = fileTypes?.find((item: any) => (
                parseInt(item.id) === parseInt(formData?.file_type_id)
            ));
            setSelectedFileType(selectedType?.attributes?.title || '');
        }, [formData?.file_type_id]);
        const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
            multiple: false,
            disabled: formData.formStatus.isDisabled ||
                (
                    formData.captionRequired &&
                    formData.caption === ''
                ),
            onDragEnter: () => setIsDragActive(true),
            onDragLeave: () => {
                setFormData((prevState: any) => ({
                    ...prevState,
                    formStatus: {
                        isDisabled: formData?.file_type_id === undefined || formData?.file_type_id === '',
                        fileTypeId: formData?.file_type_id !== undefined && formData?.file_type_id !== ''
                    }
                }));
                setIsDragActive(false)
            },
            onDropAccepted: (droppedFiles) => {
                droppedFiles.forEach((file) => {
                    addFileTrigger({
                        workflowId: props.workflowId,
                        data: {
                            file_type_id: formData.file_type_id,
                            caption: formData.caption,
                            file: file
                        }
                    }).then((response: any) => {
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
                ? <StepPlaceholder />
                :
                <Box>
                    <Typography variant="h3" mb={2}>
                        Files
                    </Typography>
                    {
                        (props.details !== undefined && props.details !== '') &&
                        <Alert color="error" sx={{ mb: 3, p: 2 }}>
                            {ReactHtmlParser(props.details)}
                        </Alert>
                    }
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                {ReactHtmlParser(stepGuide)}
                            </Alert>
                        )
                    }
                    <FormControl
                        required
                        fullWidth
                        error={
                            !formData.formStatus.fileTypeId &&
                            formData.formStatus.isDisabled
                        }
                        sx={{ mb: 3 }}
                    >
                        <FormLabel>
                            <Typography variant="title-sm">
                                File Type
                            </Typography>
                        </FormLabel>
                        {fileTypes ? (
                            <Autocomplete
                                size="small"
                                placeholder="Choose one…"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                    />
                                )}
                                options={
                                    (
                                        fileTypes &&
                                        Array.isArray(fileTypes)
                                    )
                                        ? fileTypes.map(
                                            item => {
                                                return `${item.attributes?.title
                                                    }${item.attributes?.minimum_requirement > 0 ? ' *' : ''
                                                    }` || ''
                                            }
                                        )
                                        : []
                                }
                                value={selectedFileType || ''}
                                onChange={(event, value) => {
                                    setSelectedFileType(value || '');
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        captionRequired: fileTypes.find(
                                            (item: any) =>
                                                item.attributes.title === value
                                                || `${item.attributes.title
                                                } *` === value)?.attributes.require_caption
                                            || '',
                                        file_type_id: fileTypes.find(
                                            (item: any) =>
                                                item.attributes.title === value
                                                || `${item.attributes.title} *` === value
                                        )?.id || '',
                                        formStatus: {
                                            isDisabled: value === '',
                                            fileTypeId: value !== ''
                                        }
                                    }))
                                }}
                            />
                        ) : (
                            <Typography color="error">
                                You have to choose a document type first!
                            </Typography>
                        )}
                        {
                            (
                                !formData.formStatus.fileTypeId &&
                                formData.formStatus.isDisabled
                            )
                            && <FormHelperText>
                                <Typography variant="body-sm" color="error">
                                    Please select the file type first
                                </Typography>
                            </FormHelperText>
                        }
                    </FormControl>
                    {
                        formData.captionRequired &&
                        <FormControl
                            fullWidth
                            required
                            error={formData.captionRequired && !caption['caption']}
                            sx={{ mb: 3 }}
                        >
                            <FormLabel>
                                <Typography variant="title-sm">
                                    Caption
                                </Typography>
                            </FormLabel>
                            <TextField
                                required={formData.captionRequired}
                                variant="filled"
                                name="fileCaption"
                                id="fileCaption"
                                placeholder="Write a caption"
                                value={formData?.caption || ''}
                                onChange={event =>
                                    setFormData((prevState: any) => ({
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
                                &&
                                <FormHelperText>
                                    <Typography variant="body-sm" color="error">
                                        Caption is required
                                    </Typography>
                                </FormHelperText>
                            }
                        </FormControl>
                    }
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        p={3}
                        mb={3}
                        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <Stack
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <FontAwesomeIcon
                                icon={faFileText}
                                color="warning"
                                style={{ display: 'block' }}
                            />
                            <Typography
                                component="p"
                                variant="body-sm"
                                color="muted"
                                mb={1}
                            >
                                Drag and Drop your Your File Here
                            </Typography>
                            <Button variant="contained" color="primary"
                                onClick={() => {
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        formStatus: {
                                            isDisabled: formData?.file_type_id === undefined || formData?.file_type_id === '',
                                            fileTypeId: formData?.file_type_id !== undefined && formData?.file_type_id !== ''
                                        }
                                    }))
                                }}>
                                Select File
                            </Button>
                        </Stack>
                    </Stack>
                    <Box className="datatable-container">
                        {
                            newFilteredItems && newFilteredItems.length > 0 &&
                            <DataGrid
                                columns={newColumns}
                                rows={newFilteredItems || []}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                    },
                                }}
                                sx={{
                                    fontSize: 12
                                }}
                            />
                        }
                        {/* <DataTable
                            className="datatable"
                            title={<Typography component="h4">Files</Typography>}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            persistTableHead
                            pagination
                            columns={newColumns}
                            data={newFilteredItems || []}
                        /> */}
                    </Box>
                    <Divider />
                    {/* {
                        formData.oldFiles?.length > 0 &&
                        <Box className="datatable-container"> */}
                    {/* <DataGrid
                                columns={oldColumns}
                                rows={oldFilteredItems || []}
                            /> */}
                    {/* <DataTable
                                className="datatable"
                                title={<Typography component="h4">Old Files</Typography>}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemo}
                                persistTableHead
                                pagination
                                columns={oldColumns}
                                data={oldFilteredItems || []}
                            /> */}
                    {/* </Box>
                    } */}
                </Box>
        );
    });

FilesStep.displayName = 'FilesStep';

export default FilesStep;