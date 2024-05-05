// @flow

import StepPlaceholder from "@components/partials/placeholders/step-placeholder"
import ReactHtmlParser from "react-html-parser"
import { shouldStepUpdate } from "@/app/services/validators"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Scrollbars } from "react-custom-scrollbars"
import { Alert, Box, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material"
import { useGetAgreementTermsQuery } from "@/app/services/steps/agreement"
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
    useGetStepDataQuery,
    useGetStepGuideQuery,
    useUpdateStepDataMutation
} from "@/app/services/apiSlice"
import {
    formValidator,
    handleIsVerified,
    prevStep
} from "@/app/features/wizard/wizardSlice"
import {
    Value
} from "@/app/services/types/agreement"

const AgreementStep = forwardRef(
    (
        props: {
            apiUrls: {
                stepDataApiUrl: string;
                stepGuideApiUrl: string
            };
            details: string;
            workflowId: string;
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const isVerified = useAppSelector((state: any) => state.wizard.isVerified);
        const [isValid, setIsValid] = useState<any>({
            terms: true,
        });
        const { data: agreementTerms, isLoading: agreementTermsIsLoading } = useGetAgreementTermsQuery(props.workflowId);
        const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery(props.apiUrls.stepGuideApiUrl);
        const { data: stepData, isLoading: stepDataIsLoading } = useGetStepDataQuery(props.apiUrls.stepDataApiUrl);
        const [updateStepDataTrigger] = useUpdateStepDataMutation();
        const isLoading: boolean = (agreementTermsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string')
        const [formData, setFormData] = useState<Value>({ terms: false });
        useEffect(() => {
            if (stepData) {
                setFormData(stepData);
            }
        }, [stepData]);
        useEffect(() => {
            if (stepData) {
                const formIsValid = formData?.terms || false;
                dispatch(formValidator(formIsValid));
            }
        }, [formData]);
        useEffect(() => {
            if (isVerified) {
                setIsValid((prevState: object) => ({
                    ...prevState,
                    terms: formData?.terms || ''
                }));
            }
        }, [formData, isVerified]);
        useImperativeHandle(ref, () => ({
            async submitForm() {
                let isAllowed = false;
                try {
                    const newData = {
                        id: parseInt(agreementTerms?.id),
                        version: agreementTerms?.attributes?.version,
                        ...formData,
                    };
                    if (shouldStepUpdate(stepData, formData)) {
                        await updateStepDataTrigger(
                            {
                                url: props.apiUrls.stepDataApiUrl,
                                data: newData
                            }
                        );
                    }
                    isAllowed = true;
                } catch (error) {
                    console.error("Error while submitting form:", error);
                }

                return isAllowed;
            }
        }));

        return (
            <>
                {
                    isLoading
                        ? <StepPlaceholder />
                        : <Box
                            zIndex={1000}
                            position="relative"
                            id="agreement"
                        >
                            <Typography variant="h3" mb={2}>
                                Agreement
                            </Typography>
                            {
                                (props.details !== undefined && props.details !== '') &&
                                <Alert sx={{ mb: 3, p: 2 }} severity="error">
                                    {
                                        ReactHtmlParser(props.details)
                                    }
                                </Alert>
                            }
                            {
                                typeof stepGuide === 'string' && stepGuide.trim() !== '' &&
                                <Scrollbars
                                    className="mb-4"
                                    style={{ width: 100 + '%', height: 200 }}
                                    universal={true}
                                    autoHide
                                    autoHideTimeout={500}
                                    autoHideDuration={200}>
                                    <Alert sx={{ mb: 3, p: 2 }} severity="info">
                                        <Box display="block">
                                            {
                                                ReactHtmlParser(stepGuide)
                                            }
                                        </Box>
                                    </Alert>
                                </Scrollbars>
                            }
                            <Box mb={3}>
                                <Scrollbars
                                    className="mb-4"
                                    style={{ width: 100 + '%', height: 200 }}
                                    universal={true}
                                    autoHide
                                    autoHideTimeout={627}
                                    autoHideDuration={200}
                                >
                                    {
                                        agreementTerms?.attributes?.translated_content !== undefined
                                        && <Alert severity="info" sx={{ mb: 3 }}>
                                            {
                                                ReactHtmlParser(agreementTerms.attributes.translated_content)
                                            }
                                        </Alert>
                                    }
                                </Scrollbars>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <FormControlLabel
                                required
                                control={
                                    <Checkbox
                                        name="terms"
                                        id="terms"
                                        checked={formData?.terms || false}
                                        onChange={
                                            () => {
                                                !isVerified && dispatch(handleIsVerified());
                                                setFormData(
                                                    (prevState: any) => ({
                                                        ...prevState,
                                                        terms: !formData?.terms
                                                    })
                                                )
                                            }
                                        }
                                    />
                                }
                                label={
                                    <Typography fontSize={14} variant="muted">
                                        I&apos;ve read and agree to all terms that are mentioned above
                                    </Typography>
                                }
                            />
                            {
                                (
                                    isVerified &&
                                    !isValid.terms
                                ) &&
                                <Typography
                                    fontSize={12}
                                    color="error"
                                >
                                    Please accept the terms and conditions
                                </Typography>
                            }
                        </Box>
                }
            </>
        );
    }
);

AgreementStep.displayName = "AgreementStep";

export default AgreementStep;
