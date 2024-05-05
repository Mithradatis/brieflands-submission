import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { useGetClassificationsQuery } from '@/app/services/steps/classifications'
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'
import { 
    Alert, 
    Autocomplete, 
    Box, 
    FormControl, 
    FormLabel, 
    createFilterOptions, 
    TextField, 
    Typography 
} from '@mui/material'

const ClassificationsStep = forwardRef(
    (
        props: {
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string },
            details: string
        },
        ref
    ) => {
        const [formData, setFormData] = useState<any>({
            ids: []
        });
        const dispatch = useAppDispatch();
        const isVerified = useAppSelector((state: any) => state.wizard.isVerified);
        const { data: classifications, isLoading: classificationsIsLoading } = useGetClassificationsQuery();
        const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const isLoading: boolean = (classificationsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string');
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        const filter = createFilterOptions();
        useEffect(() => {
            if (stepData) {
                setFormData({ ids: stepData });
            }
        }, [stepData]);
        useEffect(() => {
            dispatch(formValidator(true));
        }, []);
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
                <Box id="classifications" className="relative z-10">
                    <Typography variant="h3" mb={2}>
                        Classifications
                    </Typography>
                    {
                        (props.details !== undefined && props.details !== '') &&
                        <Alert color="error" sx={{ mb: 3 }}>
                            {ReactHtmlParser(props.details)}
                        </Alert>
                    }
                    {
                        (
                            typeof stepGuide === 'string' &&
                            stepGuide.trim() !== ''
                        ) && (
                            <Alert color="info" sx={{ mb: 3 }}>
                                {ReactHtmlParser(stepGuide)}
                            </Alert>
                        )
                    }
                    <FormControl 
                        required
                        fullWidth 
                        sx={{ mb: 2 }}
                    >
                        <FormLabel>
                            <Typography variant="title-sm" mb={1}>
                                Please Choose
                            </Typography>
                        </FormLabel>
                        <Autocomplete
                            multiple
                            disableClearable
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    placeholder="Choose one…"
                                />
                            )}
                            options={
                                Array.isArray(classifications)
                                    ? classifications.map(
                                        (item: any) => {
                                            return item.attributes?.title || ''
                                        }
                                    ) : []
                            }
                            value={
                                (
                                    Array.isArray(classifications) &&
                                    formData?.ids?.length > 0
                                )
                                    ? classifications
                                        .filter(
                                            (item: any) => formData?.ids.includes(item.id)
                                        )
                                        .map((item: any) => item.attributes.title)
                                    : []
                            }
                            onChange={(event, value) => {
                                const selectedIds = value.map((selectedItem) => {
                                    const selectedOption = classifications.find(
                                        (item: any) => item.attributes.title === selectedItem
                                    );

                                    return selectedOption ? selectedOption.id : '';
                                });
                                setFormData({ ids: selectedIds });
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option);

                                if (inputValue !== '' && !isExisting) {
                                    filtered.push('Nothing found');
                                }

                                return filtered.filter((option: any) => {
                                    return option !== 'Nothing found' || isExisting;
                                });
                            }}
                        />
                    </FormControl>
                </Box>
        );
    }
);

ClassificationsStep.displayName = 'ClassificationsStep';

export default ClassificationsStep;