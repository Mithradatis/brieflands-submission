import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useAppDispatch } from '@/store/store'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { useGetEditorsQuery } from '@/app/services/steps/editor'
import {
    useEffect,
    forwardRef,
    useImperativeHandle,
    useState,
    useMemo,
    useRef
} from 'react'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'
import {
    Alert,
    Autocomplete,
    Box,
    FormLabel,
    FormControl,
    TextField,
    Typography
} from '@mui/material'

type Editor = {
    id: string,
    name: string
}

const EditorStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string,
            workflowId: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const [editorsList, setEditorsList] = useState<Editor[]>([]);
        const [formData, setFormData] = useState({
            id: ''
        });
        const getAllTypesFromApi = `${process.env.SUBMISSION_API_URL}/${props.workflowId}/editor/get_all`;
        const {
            data: editors,
            isLoading: editorsIsLoading
        } = useGetEditorsQuery(getAllTypesFromApi);
        const isEditorsInitialized = useRef(false);
        useMemo(() => {
            if (editors) {
                if (!isEditorsInitialized.current) {
                    editors.forEach((element: any) => {
                        setEditorsList((prevState: any) => [...prevState, {
                            id: element.id,
                            name: `${element.attributes.first_name
                                }${element.attributes.middle_name && ` ${element.attributes.middle_name}`
                                } ${element.attributes.last_name
                                }`
                        }]);
                    });
                    isEditorsInitialized.current = true;
                }
            }
        }, [editors]);
        const {
            data: stepGuide,
            isLoading: stepGuideIsLoading
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepData,
            isLoading: stepDataIsLoading
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (
            editorsIsLoading ||
            stepGuideIsLoading ||
            stepDataIsLoading ||
            typeof stepGuide !== 'string'
        );
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
        useEffect(() => {
            if (stepData) {
                setFormData({
                    id: stepData.id
                });
            }
        }, [stepData]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = false;
                try {
                    await updateStepDataTrigger(
                        {
                            url: props.apiUrls.stepDataApiUrl,
                            data: formData
                        }
                    );
                    isAllowed = true;
                } catch (error) {
                    console.error("Error while submitting form:", error);
                }

                return isAllowed;
            }
        }));

        return (
            isLoading
                ? <StepPlaceholder />
                :
                <Box>
                    <Typography variant="h3" mb={2}>
                        Editor
                    </Typography>
                    {
                        (props.details !== undefined && props.details !== '') &&
                        <Alert color="error" sx={{ mb: 3, p: 2 }}>
                            {
                                ReactHtmlParser(props.details)
                            }
                        </Alert>
                    }
                    {
                        typeof stepGuide === 'string' && stepGuide.trim() !== '' && (
                            <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                {
                                    ReactHtmlParser(stepGuide)
                                }
                            </Alert>
                        )
                    }
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormLabel className="fw-bold mb-1">
                            Editor
                        </FormLabel>
                        {
                            editors ? (
                                <Autocomplete
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="filled"
                                            placeholder="Choose one…"
                                        />
                                    )}
                                    options={
                                        Array.isArray(editorsList)
                                            ? editorsList.map(
                                                item => {
                                                    return item.name || ''
                                                }
                                            ) : []
                                    }
                                    value={
                                        (formData?.id !== '' && editorsList?.length > 0)
                                            ? editorsList?.find((item: any) => formData?.id === item.id)?.name
                                            : null
                                    }
                                    onChange={(event, value) => {
                                        setFormData(
                                            {
                                                id: editorsList?.find(
                                                    (item: any) => item.name === value
                                                )?.id || ''
                                            }
                                        )
                                    }}
                                />
                            ) : (
                                <Typography component="p">
                                    Loading editors...
                                </Typography>
                            )
                        }
                    </FormControl>
                </Box>
        );
    });

EditorStep.displayName = 'EditorStep';

export default EditorStep;