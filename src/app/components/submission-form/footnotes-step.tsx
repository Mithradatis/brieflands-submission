import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput, handleLoading } from '@/app/features/submission/footnotesSlice'
import { getAuthorContributionStepData, getAuthorContributionStepGuide, updateAuthorContributionStepData } from '@/app/api/authorContribution' 
import { getFundingSupportStepData, getFundingSupportStepGuide, updateFundingSupportStepData } from '@/app/api/fundingSupport'
import { getConflictOfInterestsStepData, getConflictOfInterestsStepGuide, updateConflictOfInterestsStepData } from '@/app/api/conflictOfInterests'
import ReactHtmlParser from 'react-html-parser'

const FootnotesStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( stepState );
    const wizard: any = useSelector( wizardState );
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
    const getAuthorsContributionDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/authors_contribution`;
    const getFundingSupportDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/funding_support`;
    const getConflictOfInterestsDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/conflict_of_interests`;
    const getAuthorsContributionDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.authors_contribution`;
    const getFundingSupportDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.funding_support`;
    const getConflictOfInterestsDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.conflict_of_interests`;
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
        dispatch( getAuthorContributionStepData( getAuthorsContributionDataFromApi ) );
        dispatch( getFundingSupportStepData( getFundingSupportDataFromApi ) );
        dispatch( getConflictOfInterestsStepData( getConflictOfInterestsDataFromApi ) );
        dispatch( getAuthorContributionStepGuide( getAuthorsContributionDictionaryFromApi ) );
        dispatch( getFundingSupportStepGuide( getFundingSupportDictionaryFromApi ) );
        dispatch( getConflictOfInterestsStepGuide( getConflictOfInterestsDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
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
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'authors_contribution' ).required ? ' required' : '' }`}>
                                <FormLabel className="fw-bold mb-1">
                                    Author Contribution
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="authorsContribution"
                                    id="authorsContribution"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    defaultValue={ formState.value?.authorsContribution?.text ? formState.value.authorsContribution.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
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
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'funding_support' ).required ? ' required' : '' }`}>
                                <FormLabel className="fw-bold mb-1">
                                    Funding/Support
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="fundingSupport"
                                    id="fundingSupport"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    defaultValue={ formState.value?.fundingSupport.text ? formState.value.fundingSupport.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
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
                            <FormControl className={`mb-3 ${ subSteps.find( ( subStep: any ) => subStep.slug === 'conflict_of_interests' ).required ? ' required' : '' }`}>
                                <FormLabel className="fw-bold mb-1">
                                    Conflict of Interests
                                </FormLabel>
                                <Textarea
                                    variant="soft"
                                    name="conflictOfInterests"
                                    id="conflictOfInterests"
                                    className="rounded"
                                    aria-label="textarea"
                                    placeholder="Enter your text here"
                                    minRows={4}
                                    maxRows={10}
                                    defaultValue={ formState.value?.conflictOfInterests?.text ? formState.value.conflictOfInterests.text : '' }
                                    onChange={( event: any ) => {
                                        dispatch( handleInput( { name: event.target.name, value: event.target.value } ) );
                                    }}
                                />
                            </FormControl>
                        </div>
                }
            </div>
        </>
    );
});

FootnotesStep.displayName = 'FootnotesStep';

export default FootnotesStep;