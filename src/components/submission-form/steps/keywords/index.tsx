import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { formValidator, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import {
    Alert,
    Autocomplete,
    Box,
    Chip,
    FormControl,
    FormLabel,
    FormHelperText,
    createFilterOptions,
    TextField,
    Typography
} from '@mui/material'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'
import {
    useLazyFindKeywordsQuery,
    useLazyGetKeywordsQuery,
    useGetKeywordsListQuery,
    useAddNewKeywordMutation
} from '@/app/services/steps/keywords'
const KeywordsStep = forwardRef(
    (
        props: {
            apiUrls: {
                stepDataApiUrl: string,
                stepGuideApiUrl: string
            },
            details: string,
            workflowId: string
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const isVerified = useAppSelector((state: any) => state.wizard.isVerified);
        const [isSearching, setIsSearching] = useState<boolean>(false);
        const [keywordsBuffer, setKeywordsBuffer] = useState<object[]>([]);
        const [keywordsList, setKeywordsList] = useState<object[]>([]);
        const [formData, setFormData] = useState<any>({
            ids: [],
        });
        const getAllKeywordsFromApi = 'journal/keyword';
        const {
            data: allKeywords,
            isLoading: allKeywordsIsLoading
        } = useGetKeywordsListQuery(getAllKeywordsFromApi);
        const {
            data: stepGuide,
            isLoading: stepGuideIsLoading
        } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const {
            data: stepData,
            isLoading: stepDataIsLoading
        } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (
            allKeywordsIsLoading &&
            stepGuideIsLoading &&
            stepDataIsLoading &&
            typeof stepGuide !== 'string'
        );
        const [getKeywordsTrigger] = useLazyGetKeywordsQuery();
        const [findKeywordsTrigger] = useLazyFindKeywordsQuery();
        const [addNewKeywordTrigger] = useAddNewKeywordMutation();
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        const filter = createFilterOptions();
        const hasRunRef = useRef(false);
        useEffect(() => {
            if (stepData) {
                if (!hasRunRef.current) {
                    if (formData.ids.indexOf(stepData) === -1) {
                        setFormData((prevState: any) => (
                            {
                                ...prevState,
                                ids: stepData
                            }
                        ));
                    }
                    stepData.map((item: any) => {
                        const findKeywordInApi = `${getAllKeywordsFromApi}/${item}`;
                        getKeywordsTrigger(findKeywordInApi).then((response: any) => {
                            setKeywordsList(prevState => [...prevState, response.data]);
                        });
                    });
                    hasRunRef.current = true;
                }  
            }
        }, [stepData]);
        useEffect(() => {
            const formIsValid = Object.values(formData).every((value: any) => value.length > 0);
            dispatch(formValidator(formIsValid));
        }, [formData]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = false;
                try {
                    await updateStepDataTrigger({
                        url: props.apiUrls.stepDataApiUrl,
                        data: formData
                    });
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
                : <Box>
                    <Typography variant="h3" mb={2}>
                        Keywords
                    </Typography>
                    {
                        (
                            props.details !== undefined &&
                            props.details !== ''
                        ) &&
                        <Alert color="error" sx={{ mb: 3, p: 2 }}>
                            {
                                ReactHtmlParser(props.details)
                            }
                        </Alert>
                    }
                    {
                        (
                            typeof stepGuide === 'string' &&
                            stepGuide.trim() !== ''
                        ) && (
                            <Alert color="info" sx={{ mb: 3, p: 2 }}>
                                {
                                    ReactHtmlParser(stepGuide)
                                }
                            </Alert>
                        )
                    }
                    <FormControl
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                        error={
                            isVerified &&
                            formData?.ids?.length === 0
                        }>
                        <FormLabel>
                            <Typography variant="title-sm" mb={2}>
                                Please Choose
                            </Typography>
                        </FormLabel>
                        <Autocomplete
                            multiple
                            freeSolo
                            disableClearable
                            size="small"
                            disabled={false}
                            loading={isSearching}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    placeholder="Choose one…"
                                />
                            )}
                            renderTags={(tags) =>
                                tags.map((item, index) => (
                                    <Chip
                                        key={`keyword-label-${index}`}
                                        size="small"
                                        variant="filled"
                                        color="primary"
                                        label={item}
                                        sx={{ minWidth: 0, mr: 1, fontSize: 12 }}
                                    />
                                ))
                            }
                            options={keywordsBuffer?.length > 0
                                ? keywordsBuffer.map((item: any) => item.attributes?.title)
                                : []
                            }
                            value={
                                keywordsList?.length > 0
                                    ? keywordsList.map((item: any) => item?.attributes?.title)
                                    : []
                            }
                            onInputChange={async (event, value) => {
                                if (value.length > 0) {
                                    const findKeywordInApi =
                                        `${getAllKeywordsFromApi}?filter[title]=${value}`;
                                    setIsSearching(true);
                                    const foundedKeywords = await findKeywordsTrigger(findKeywordInApi);
                                    await setKeywordsBuffer(foundedKeywords.data);
                                    setIsSearching(false);
                                } else {
                                    setKeywordsBuffer([]);
                                }
                            }}
                            onChange={(event, value, reason) => {
                                !isVerified && dispatch(handleIsVerified());
                                const selectedIds: any = [];
                                const handleKeywordSelection = async (keyword: any) => {
                                    if (value.length > 0) {
                                        const findKeywordInApi =
                                            `${getAllKeywordsFromApi}?filter[title]=${keyword}`;
                                        setIsSearching(true);
                                        const foundedKeywords = await findKeywordsTrigger(findKeywordInApi);
                                        await setKeywordsBuffer(foundedKeywords.data);
                                        setIsSearching(false);
                                        let isNewKeyword = true;
                                        isNewKeyword = !keywordsBuffer.some(
                                            (item: any) => item.attributes.title === keyword
                                        );
                                        if (isNewKeyword) {
                                            const newKeyword = {
                                                "title": keyword,
                                                "show_in_cloud": true
                                            }
                                            const newAddedKeyword = await addNewKeywordTrigger(
                                                {
                                                    url: getAllKeywordsFromApi,
                                                    data: newKeyword
                                                }
                                            );
                                            keywordsList.push(newAddedKeyword.data);
                                            setFormData((prevState: { ids: string[] }) => ({
                                                ...prevState,
                                                ids: [...prevState.ids, newAddedKeyword.data.id],
                                            }));
                                        } else {
                                            const selectedOptions: any = [];
                                            const selectedOption: any = keywordsBuffer.find(
                                                (item: any) => item.attributes.title.trim() === keyword
                                            );
                                            const isDuplicate = keywordsList.some(
                                                (item: any) => (
                                                    selectedOption && item.id === selectedOption.id
                                                )
                                            );
                                            if (!isDuplicate) {
                                                selectedOptions.push(selectedOption?.id);
                                                keywordsList.push(selectedOption);
                                                setFormData((prevState: { ids: string[] }) => ({
                                                    ...prevState,
                                                    ids: [...prevState.ids, selectedOption.id],
                                                }));
                                            }
                                        }
                                    }
                                };
                                if (reason === 'selectOption') {
                                    handleKeywordSelection(value[value.length - 1]);
                                }
                                if (reason === 'removeOption') {
                                    setKeywordsList([]);
                                    value.forEach((title: string) => {
                                        const selectedOption: any = keywordsList.find(
                                            (item: any) => item.attributes?.title.trim() === title
                                        );
                                        if (selectedOption) {
                                            setKeywordsList(prevState => [...prevState, selectedOption]);
                                            selectedIds.push(selectedOption?.id);
                                        }
                                    });
                                    setFormData({ ids: selectedIds });
                                }
                                setKeywordsBuffer([]);
                            }}
                            filterOptions={(options, params) => {
                                if (isSearching) {
                                    return ['Please wait...'];
                                }
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) =>
                                    inputValue === option
                                );
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push(inputValue);
                                }

                                return filtered;
                            }}
                            getOptionDisabled={(option: any) =>
                                option === 'Please wait...'
                            }
                        />
                        {
                            (
                                isVerified &&
                                formData?.ids?.length === 0
                            ) &&
                            <FormHelperText>
                                <Typography variant="body-sm" color="error">
                                    You should enter at least one keyword
                                </Typography>
                            </FormHelperText>
                        }
                    </FormControl>
                </Box>
        );
    }
);

KeywordsStep.displayName = 'KeywordsStep';

export default KeywordsStep;