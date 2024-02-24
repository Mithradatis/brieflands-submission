import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { FormControl, FormLabel, Textarea, FormHelperText } from '@mui/joy'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/footnotes/footnotesSlice'
import { 
    getAuthorContributionStepData, 
    getAuthorContributionStepGuide, 
    updateAuthorContributionStepData 
} from '@/lib/api/steps/authors-contribution' 
import { 
    getFundingSupportStepData, 
    getFundingSupportStepGuide, 
    updateFundingSupportStepData 
} from '@/lib/api/steps/funding-support'
import { 
    getConflictOfInterestsStepData, 
    getConflictOfInterestsStepGuide, 
    updateConflictOfInterestsStepData 
} from '@/lib/api/steps/conflict-of-interests'

const FootnotesStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( ( state: any ) => state.footnotesSlice );
    const wizard: any = useSelector( ( state: any ) => state.wizardSlice );
    const [ subSteps, setSubSteps ]: any = useState([]);
    const [ authorsContributionStep, setAuthorsContributionStep ] = useState( false );
    const [ fundingSupportStep, setFundingSupportStep ] = useState( false );
    const [ conflictOfInterestsStep, setConflictOfInterestsStep ] = useState( false );
    const authorsContributionDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'authors_contribution' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const fundingSupportDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'funding_support' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const conflictOfInterestsDetails = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === 'conflict_of_interests' && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAuthorsContributionDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/authors_contribution`;
    const getFundingSupportDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/funding_support`;
    const getConflictOfInterestsDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/conflict_of_interests`;
    const getAuthorsContributionDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.authors_contribution`;
    const getFundingSupportDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.funding_support`;
    const getConflictOfInterestsDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.conflict_of_interests`;
    const [ isValid, setIsValid ] = useState({
        authorsContribution: true,
        fundingSupport: true,
        conflictOfInterests: true
    });
    useEffect( () => {
        const subStepsList = wizard.formSteps.length > 0 ? wizard.formSteps.find( ( item: any ) => item.attributes.slug === wizard.formStep ).attributes.subSteps : [];
        setSubSteps( subStepsList );
        if ( subStepsList.length > 0 ) {
            subStepsList.map( ( subStep: any ) =>  {
                subStep.slug === 'authors_contribution' && setAuthorsContributionStep( true );
                subStep.slug === 'funding_support' && setFundingSupportStep( true );
                subStep.slug === 'conflict_of_interests' && setConflictOfInterestsStep( true );
            });
        }
    }, [wizard.formSteps]);
    useEffect( () => {
        if ( wizard.formStep === 'footnotes' ) {
            dispatch( getAuthorContributionStepData( getAuthorsContributionDataFromApi ) );
            dispatch( getFundingSupportStepData( getFundingSupportDataFromApi ) );
            dispatch( getConflictOfInterestsStepData( getConflictOfInterestsDataFromApi ) );
            dispatch( getAuthorContributionStepGuide( getAuthorsContributionDictionaryFromApi ) );
            dispatch( getFundingSupportStepGuide( getFundingSupportDictionaryFromApi ) );
            dispatch( getConflictOfInterestsStepGuide( getConflictOfInterestsDictionaryFromApi ) );
            dispatch( formValidator( true ) );
        }
    }, []);
    useEffect(() => {
        if ( subSteps.length > 0 ) {
            const requiredFields: any = [];
            subSteps.map( ( item: any ) =>  { 
                item.required && requiredFields.push( item.slug ); 
            });
            const formIsValid = Object.entries( formState.value ).every( ( [ key, value ] ) =>  {
                const step: any = value;  
                return requiredFields.includes( key ) ? step.text !== '' : true 
            });
            dispatch( formValidator( formIsValid ) );
        }
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if ( wizard.isVerified ) {
            setIsValid( prevState => ({
                ...prevState,
                authorsContribution: subSteps.find( ( item: any ) => item.slug === 'authors_contribution' )?.required ? formState.value?.authors_contribution?.text !== '' : true,
                fundingSupport: subSteps.find( ( item: any ) => item.slug === 'funding_support' )?.required ? formState.value?.funding_support?.text !== '' : true,
                conflictOfInterests: subSteps.find( ( item: any ) => item.slug === 'conflict_of_interests' )?.required ? formState.value?.conflict_of_interests?.text !== '' : true
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );
          let isAllowed = false;
          try {   
            await dispatch( updateAuthorContributionStepData( getAuthorsContributionDataFromApi ) );
            await dispatch( updateFundingSupportStepData( getFundingSupportDataFromApi ) );
            await dispatch( updateConflictOfInterestsStepData( getConflictOfInterestsDataFromApi ) );
          isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }

          return isAllowed;
        }
    }));

    return (
        <>
            <div className={ `step-loader 
                ${ ( formState.isLoading 
                    || ( 
                        ( authorsContributionStep && typeof formState.stepGuide.authorsContribution !== 'string' )
                        || ( fundingSupportStep && typeof formState.stepGuide.fundingSupport !== 'string' )
                        || ( conflictOfInterestsStep && typeof formState.stepGuide.conflictOfInterests !== 'string' ) 
                    ) ) 
                    ? ' d-block' : ' d-none' }` 
                }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="footnotes" className={ `tab ${ ( formState.isLoading 
                    || ( 
                        ( authorsContributionStep && typeof formState.stepGuide.authorsContribution !== 'string' )
                        || ( fundingSupportStep && typeof formState.stepGuide.fundingSupport !== 'string' )
                        || ( conflictOfInterestsStep && typeof formState.stepGuide.conflictOfInterests !== 'string' ) 
                    ) ) 
                    ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Footnotes</h3>
                <Alert severity="info" className="mb-4">
                    {   
                        ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'authors_contribution' ) && formState.stepGuide.authorsContribution !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.authorsContribution ) }</div>
                    }
                    {   
                        ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'funding_support' ) && formState.stepGuide.fundingSupport !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.fundingSupport ) }</div>
                    }
                    {
                        ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'conflict_of_interests' ) && formState.stepGuide.conflictOfInterests !== undefined ) &&     
                            <div className="mb-2 fs-7">{ ReactHtmlParser( formState.stepGuide.conflictOfInterests ) }</div>
                    }
                 </Alert>
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'authors_contribution' ) ) &&
                        <div id="authors-contribution">
                            {
                                ( authorsContributionDetails !== undefined && authorsContributionDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( authorsContributionDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'authors_contribution' ).required ? ' required' : '' }`} 
                                error={ wizard.isVerified && formState.value?.authors_contribution?.text === '' && !isValid.authorsContribution }>
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
                                    value={ formState.value?.authors_contribution?.text ? formState.value?.authors_contribution?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.authors_contribution?.text === '' && !isValid.authorsContribution ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText> 
                                }
                            </FormControl>
                        </div>
                }
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'funding_support' ) ) &&
                        <div id="funding-support">
                            {
                                ( fundingSupportDetails !== undefined && fundingSupportDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( fundingSupportDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'funding_support' ).required ? ' required' : '' }`}
                                error={ wizard.isVerified && formState.value?.funding_support?.text === '' && !isValid.fundingSupport }>
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
                                    value={ formState.value?.funding_support?.text ? formState.value?.funding_support?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.funding_support?.text === '' && !isValid.fundingSupport ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText> 
                                }
                            </FormControl>
                        </div>
                }
                {
                    ( subSteps.length > 0 && subSteps.find( ( subStep: any ) => subStep.slug === 'conflict_of_interests' ) ) &&
                        <div id="conflict-of-interests">
                            {
                                ( conflictOfInterestsDetails !== undefined && conflictOfInterestsDetails !== '' ) &&
                                    <Alert severity="error" className="mb-4">
                                        { ReactHtmlParser( conflictOfInterestsDetails ) }
                                    </Alert>
                            }
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'conflict_of_interests' ).required ? ' required' : '' }`}
                                error={ wizard.isVerified && formState.value?.conflict_of_interests?.text === '' && !isValid.conflictOfInterests }>
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
                                    value={ formState.value?.conflict_of_interests?.text ? formState.value?.conflict_of_interests?.text : '' }
                                    onChange={( event: any ) => {
                                        !wizard.isVerified && dispatch( handleIsVerified() );
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                                {
                                    ( wizard.isVerified && formState.value?.conflict_of_interests?.text === '' && !isValid.conflictOfInterests ) 
                                    && <FormHelperText className="fs-7 text-danger mt-1">This field is required</FormHelperText> 
                                }
                            </FormControl>
                        </div>
                }
            </div>
        </>
    );
});

FootnotesStep.displayName = 'FootnotesStep';

export default FootnotesStep;