import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { formValidator } from '@features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea, FormHelperText } from '@mui/joy'
import { handleLoading } from '@features/submission/steps/footnotes/footnotesSlice'
import {
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const FootnotesStep = forwardRef(
    ( 
        props: { 
            apiUrls: { 
                stepDataApiUrl: string, 
                stepGuideApiUrl: string 
            },
            workflowId: string,
            screeningDetails: any
        }, 
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const formSteps = useAppSelector( ( state: any ) => state.wizard.formSteps );
    const [ subSteps, setSubSteps ]: any = useState([]);
    const [ authorsContributionStep, setAuthorsContributionStep ] = useState( false );
    const [ fundingSupportStep, setFundingSupportStep ] = useState( false );
    const [ conflictOfInterestsStep, setConflictOfInterestsStep ] = useState( false );
    const authorsContributionDetails = props.screeningDetails?.find( ( item: any ) => 
        ( 
            item.attributes?.step_slug === 'authors_contribution' && 
            item.attributes?.status === 'invalid' 
        ) )?.attributes?.detail || '';
    const fundingSupportDetails = props.screeningDetails?.find( ( item: any ) => 
        ( 
            item.attributes?.step_slug === 'funding_support' && 
            item.attributes?.status === 'invalid' 
        ) )?.attributes?.detail || '';
    const conflictOfInterestsDetails = props.screeningDetails?.find( ( item: any ) => 
        ( 
            item.attributes?.step_slug === 'conflict_of_interests' && 
            item.attributes?.status === 'invalid' 
        ) )?.attributes?.detail || '';
    const getAuthorsContributionDataFromApi = 
        `${ props.workflowId }/authors_contribution`;
    const getFundingSupportDataFromApi = 
        `${ props.workflowId }/funding_support`;
    const getConflictOfInterestsDataFromApi = 
        `${ props.workflowId }/conflict_of_interests`;
    const getAuthorsContributionDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }authors_contribution`;
    const getFundingSupportDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }funding_support`;
    const getConflictOfInterestsDictionaryFromApi = 
        `${ process.env.DICTIONARY_API_URL }conflict_of_interests`;
    const [ formData, setFormData ] = useState({
        authorsContribution: {
            text: ''
        },
        fundingSupport: {
            text: ''
        },
        conflictOfInterests: {
            text: ''
        }
    });
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    const { 
        data: authorsContributionStepGuide, 
        isLoading: authorsContributionStepGuideIsLoading 
    } = useGetStepGuideQuery( getAuthorsContributionDictionaryFromApi );
    const { 
        data: authorsContributionStepData, 
        isLoading: authorsContributionStepDataIsLoading 
    } = useGetStepDataQuery( getAuthorsContributionDataFromApi );
    const { 
        data: fundingSupportStepGuide, 
        isLoading: fundingSupportStepGuideIsLoading 
    } = useGetStepGuideQuery( getFundingSupportDictionaryFromApi );
    const { 
        data: fundingSupportStepData, 
        isLoading: fundingSupportStepDataIsLoading 
    } = useGetStepDataQuery( getFundingSupportDataFromApi );
    const { 
        data: conflictOfInterestsStepGuide, 
        isLoading: conflictOfInterestsStepGuideIsLoading 
    } = useGetStepGuideQuery( getConflictOfInterestsDictionaryFromApi );
    const { 
        data: conflictOfIntenrestsStepData, 
        isLoading: conflictOfInterestsStepDataIsLoading 
    } = useGetStepDataQuery( getConflictOfInterestsDataFromApi );
    const isLoading: boolean = (
        (
            authorsContributionStep &&
            authorsContributionStepGuideIsLoading && 
            authorsContributionStepDataIsLoading && 
            typeof authorsContributionStepGuide !== 'string'
        ) || (
            fundingSupportStep &&
            fundingSupportStepGuideIsLoading &&
            fundingSupportStepDataIsLoading &&
            typeof fundingSupportStepGuide !== 'string'
        ) || (
            conflictOfInterestsStep &&
            conflictOfInterestsStepGuideIsLoading &&
            conflictOfInterestsStepDataIsLoading &&
            typeof conflictOfInterestsStepGuide !== 'string' 
        )
    );
    useEffect(() => {
        authorsContributionStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    authorsContribution: authorsContributionStepData 
                } 
            ) 
        );
        fundingSupportStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    fundingSupport: fundingSupportStepData 
                } 
            ) 
        );
        conflictOfIntenrestsStepData && setFormData( 
            ( prevState: any ) => (
                { 
                    ...prevState, 
                    conflictOfIntenrests: conflictOfIntenrestsStepData 
                } 
            ) 
        );
    }, [authorsContributionStepData, fundingSupportStepData, conflictOfIntenrestsStepData]);
    useEffect( () => {
        const subStepsList = formSteps.length > 0 
            ? formSteps?.find( 
                ( item: any ) => item.attributes.slug === 'footnotes' )?.attributes?.subSteps
            : [];
        setSubSteps( subStepsList );
        if ( subStepsList && subStepsList.length > 0 ) {
            subStepsList.map( ( subStep: any ) =>  {
                subStep.slug === 'authors_contribution' && setAuthorsContributionStep( true );
                subStep.slug === 'funding_support' && setFundingSupportStep( true );
                subStep.slug === 'conflict_of_interests' && setConflictOfInterestsStep( true );
            });
        }
    }, [formSteps]);
    useEffect( () => {
        dispatch( formValidator( true ) );
    }, []);
    useEffect(() => {
        if ( subSteps?.length > 0 ) {
            const requiredFields: any = [];
            subSteps.map( ( item: any ) =>  { 
                item.required && requiredFields.push( item.slug ); 
            });
            const formIsValid = Object.entries( formData ).every( ( [ key, value ] ) =>  {
                const step: any = value;  
                return requiredFields.includes( key ) ? step.text !== '' : true 
            });
            dispatch( formValidator( formIsValid ) );
        }
    }, [formData]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );
          let isAllowed = false;
          try {   
            await updateStepDataTrigger( 
                { 
                    url: getAuthorsContributionDataFromApi, 
                    data: formData.authorsContribution 
                } 
            )
            await updateStepDataTrigger( 
                { 
                    url: getFundingSupportDataFromApi, 
                    data: formData.fundingSupport 
                } 
            );
            await updateStepDataTrigger( 
                { 
                    url: getConflictOfInterestsDataFromApi, 
                    data: formData.conflictOfInterests 
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
            ? <StepPlaceholder/>
            : 
                <div id="footnotes" className="tab">
                    <h3 className="mb-4 text-shadow-white">Footnotes</h3>
                    <Alert severity="info" className="mb-4">
                        {   
                            ( subSteps?.length > 0 && subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'authors_contribution' ) && 
                                authorsContributionStepGuide !== undefined ) &&     
                                <div className="mb-2 fs-7">
                                    { ReactHtmlParser( authorsContributionStepGuide ) }
                                </div>
                        }
                        {   
                            ( subSteps?.length > 0 && subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'funding_support' ) && 
                                fundingSupportStepGuide !== undefined ) &&     
                                <div className="mb-2 fs-7">
                                    { ReactHtmlParser( fundingSupportStepGuide ) }
                                </div>
                        }
                        {
                            ( subSteps?.length > 0 && subSteps.find( 
                                ( subStep: any ) => subStep.slug === 'conflict_of_interests' ) && 
                                conflictOfInterestsStepGuide !== undefined ) &&     
                                <div className="mb-2 fs-7">
                                    { ReactHtmlParser( conflictOfInterestsStepGuide ) }
                                </div>
                        }
                    </Alert>
                    {
                        ( 
                            subSteps?.length > 0 && subSteps.find( 
                            ( subStep: any ) => subStep.slug === 'authors_contribution' ) 
                        ) &&
                            <div id="authors-contribution">
                                {
                                    ( 
                                        authorsContributionDetails !== undefined && 
                                        authorsContributionDetails !== '' 
                                    ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( authorsContributionDetails ) }
                                        </Alert>
                                }
                                <FormControl className={`mb-3 ${ 
                                    subSteps.find( 
                                        ( subStep: any ) => subStep.slug === 'authors_contribution' ).required 
                                            ? ' required' 
                                            : '' 
                                    }`} 
                                    error={ 
                                        isVerified && 
                                        formData.authorsContribution?.text === ''
                                    }
                                >
                                    <FormLabel className="fw-bold mb-1">
                                        Author Contribution
                                    </FormLabel>
                                    <Textarea
                                        variant="soft"
                                        name="authors_contribution"
                                        id="authorsContribution"
                                        className="rounded"
                                        aria-label="textarea"
                                        placeholder="Enter your text here"
                                        minRows={4}
                                        maxRows={10}
                                        value={ 
                                            formData.authorsContribution?.text 
                                                ? formData.authorsContribution?.text 
                                                : '' 
                                        }
                                        onChange={( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    authorsContribution: { text: event.target.value } 
                                                }
                                            ))
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData.authorsContribution?.text === ''
                                        ) 
                                        && <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText>
                                    }
                                </FormControl>
                            </div>
                    }
                    {
                        ( 
                            subSteps?.length > 0 && 
                            subSteps.find( ( subStep: any ) => subStep.slug === 'funding_support' ) 
                        ) &&
                            <div id="funding-support">
                                {
                                    ( fundingSupportDetails !== undefined && fundingSupportDetails !== '' ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( fundingSupportDetails ) }
                                        </Alert>
                                }
                                <FormControl className={`mb-3 ${ 
                                    subSteps.find( 
                                        ( subStep: any ) => subStep.slug === 'funding_support' ).required 
                                            ? ' required' 
                                            : '' 
                                    }`}
                                    error={ 
                                        isVerified && 
                                        formData?.fundingSupport?.text === ''
                                    }
                                >
                                    <FormLabel className="fw-bold mb-1">
                                        Funding/Support
                                    </FormLabel>
                                    <Textarea
                                        variant="soft"
                                        name="funding_support"
                                        id="fundingSupport"
                                        className="rounded"
                                        aria-label="textarea"
                                        placeholder="Enter your text here"
                                        minRows={4}
                                        maxRows={10}
                                        value={ 
                                            formData?.fundingSupport?.text 
                                                ? formData?.fundingSupport?.text 
                                                : '' 
                                        }
                                        onChange={( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    fundingSupport: { text: event.target.value } 
                                                }
                                            ))
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData?.fundingSupport?.text === ''
                                        ) 
                                        && <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText> 
                                    }
                                </FormControl>
                            </div>
                    }
                    {
                        ( 
                            subSteps?.length > 0 && 
                            subSteps.find( ( subStep: any ) => subStep.slug === 'conflict_of_interests' ) 
                        ) &&
                            <div id="conflict-of-interests">
                                {
                                    ( 
                                        conflictOfInterestsDetails !== undefined && 
                                        conflictOfInterestsDetails !== '' 
                                    ) &&
                                        <Alert severity="error" className="mb-4">
                                            { ReactHtmlParser( conflictOfInterestsDetails ) }
                                        </Alert>
                                }
                                <FormControl className={`mb-3 ${ 
                                    subSteps.find( 
                                        ( subStep: any ) => subStep.slug === 'conflict_of_interests' ).required 
                                            ? ' required' 
                                            : '' 
                                    }`}
                                    error={ 
                                        isVerified && 
                                        formData?.conflictOfInterests?.text === ''
                                    }
                                >
                                    <FormLabel className="fw-bold mb-1">
                                        Conflict of Interests
                                    </FormLabel>
                                    <Textarea
                                        variant="soft"
                                        name="conflict_of_interests"
                                        id="conflictOfInterests"
                                        className="rounded"
                                        aria-label="textarea"
                                        placeholder="Enter your text here"
                                        minRows={4}
                                        maxRows={10}
                                        value={ 
                                            formData?.conflictOfInterests?.text 
                                                ? formData?.conflictOfInterests?.text 
                                                : '' 
                                        }
                                        onChange={( event: any ) => {
                                            setFormData( ( prevState: any ) => (
                                                {
                                                    ...prevState, 
                                                    conflictOfInterests: { text: event.target.value } 
                                                }
                                            ))
                                        }}
                                    />
                                    {
                                        ( 
                                            isVerified && 
                                            formData?.conflictOfInterests?.text === '' 
                                        ) && 
                                            <FormHelperText className="fs-7 text-danger mt-1">
                                                This field is required
                                            </FormHelperText> 
                                    }
                                </FormControl>
                            </div>
                    }
                </div>
    );
});

FootnotesStep.displayName = 'FootnotesStep';

export default FootnotesStep;