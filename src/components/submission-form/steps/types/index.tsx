import ReactHtmlParser from 'react-html-parser'
import * as ReactDOMServer from 'react-dom/server'
import { useState, useEffect,forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormHelperText, Input, FormLabel, FormControl } from '@mui/joy'
import { formValidator, handleIsVerified, setFormStep } from '@/lib/features/wizard/wizardSlice'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/types/typesSlice'
import { handleDialogOpen } from '@/lib/features/dialog/dialogSlice'
import { getSubmissionSteps, getWorkflow } from '@/lib/api/client'
import { 
    getTypesStepData, 
    getTypesStepGuide, 
    updateTypesStepData, 
    getSameArticles, 
    getSameArticlesGuide 
} from '@/lib/api/steps/types'

const TypesStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState: any = useSelector( ( state: any ) => state.typesSlice );
    const wizard: any = useSelector( ( state: any ) => state.wizardSlice );
    const types = wizard.typesList;
    const [ isValid, setIsValid ] = useState({
        doc_type: true,
        manuscript_title: true
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/type`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'types' ) {
            dispatch( getTypesStepData( getStepDataFromApi ) );
            dispatch( getTypesStepGuide( getDictionaryFromApi ) );
        }
    }, []);
    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect(() => {
        if ( wizard.isVerified ) {
            setIsValid( prevState => ({
                ...prevState,
                doc_type: formState.value?.doc_type !== '',
                manuscript_title: formState.value?.manuscript_title !== ''
            }));
        }
    }, [formState.value, wizard.isVerified]);
    const getWorkflowFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }`;
    const getStepsFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/steps`;
    const getSameArticlesFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/type/same_articles`;
    const getSameArticlesGuideFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.similar_article`;
    useImperativeHandle(ref, () => ({
        async submitForm() {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;
          try {
            await dispatch(
              getSameArticles({
                url: getSameArticlesFromApi,
                documentDetails: {
                    doc_type: formState.value?.doc_type,
                    manuscript_title: formState.value?.manuscript_title
                }
              })
            ).then( async ( data: any ) => {
                const sameArticles = data.payload;
                await dispatch( getSameArticlesGuide( getSameArticlesGuideFromApi ) ).then( async ( data: any ) => {
                    const sameArticlesGuide = data.payload;
                    if ( sameArticles !== undefined && sameArticles.length > 0 ) {
                        const sameArticlesTable = <div className="alert alert-warning" role="alert">
                            <div className="fs-7 mb-4 d-flex align-items-start justify-content-start">
                                <i className="fs-5 me-2 text-warning fa-regular fa-triangle-exclamation"></i>
                                <div className="d-block">
                                    { ReactHtmlParser( sameArticlesGuide ) }
                                </div>
                            </div>
                            <table className='fs-7 table table-bordered table-striped table-responsive'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>State</th>
                                        <th>Correspond</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        sameArticles.map( ( row: any ) => 
                                            <tr key={ `same-article-${ row.id }` }>
                                                <td>{ row.id }</td>
                                                <td>{ row.title }</td>
                                                <td>{ row.state }</td>
                                                <td>{ row.correspond }</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>;
                        dispatch( handleDialogOpen(
                            {
                                actions: {
                                    updateTypesStepData: getStepDataFromApi, 
                                    getWorkflow: getWorkflowFromApi, 
                                    getSubmissionSteps: getStepsFromApi,
                                    currentFormStep: wizard.formStep
                                },
                                approvePhrase: 'Proceed',
                                denyPhrase: 'Cancel',
                                dialogTitle: 'Same Articles', 
                                dialogContent: { content: ReactDOMServer.renderToString( sameArticlesTable ) },
                                dialogAction: 'proceed-submission'
                            } 
                        ));
                        isAllowed = false;
                    } else {
                        isAllowed = true;
                        await dispatch( updateTypesStepData( getStepDataFromApi ) );
                        await dispatch( getWorkflow( getWorkflowFromApi ) )
                        await dispatch( getSubmissionSteps( getStepsFromApi ) );
                    }    
                });
            });
          } catch (error) {
            console.error("Error while submitting form:", error);
          }
          await dispatch( setFormStep( 'types' ) );

          return isAllowed;
        },
      }));

    return (
        <>
            <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="types" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Types</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' && (
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                    )
                }
                <FormControl className="mb-3 required" error={ wizard.isVerified && formState.value?.doc_type === '' && !isValid.doc_type }>
                    <FormLabel className="fw-bold mb-1">
                        Manuscript Type
                    </FormLabel>
                    { types ? (
                        <Autocomplete
                            required
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="doc_type"
                            id="doc_type"
                            options={ 
                                Array.isArray( types ) 
                                ? types.map( 
                                    item => {
                                        return item.attributes?.title || '' 
                                    }
                                   ) : []
                            }
                            value={
                                ( formState.value?.hasOwnProperty( 'doc_type' ) && formState.value?.doc_type !== '' )
                                  ? types
                                      .find( ( item: any ) => parseInt( item.id ) === parseInt( formState.value?.doc_type )  )?.attributes?.title
                                  : null
                            }
                            onChange={(event, value) => {
                                !wizard.isVerified && dispatch( handleIsVerified() );
                                dispatch( handleInput({ 
                                        name: 'doc_type',
                                        value: types.find( 
                                            ( item: any ) => item.attributes.title === value )?.id || '' } 
                                            ) 
                                        )
                            }}
                        />
                        ) : (
                        <div>Loading document types...</div>
                    )}
                    {
                        ( wizard.isVerified && formState.value?.doc_type === '' && !isValid.doc_type ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should select a document type</FormHelperText> 
                    }
                </FormControl>
                <FormControl className="mb-3 required" error={ wizard.isVerified && formState.value?.manuscript_title === '' && !isValid.manuscript_title}>
                    <FormLabel className="fw-bold mb-1">
                        Title
                    </FormLabel>
                    <Input
                        required
                        variant="soft"
                        name="manuscript_title"
                        id="manuscript_title"
                        placeholder="Manuscript Title"
                        value={ formState.value?.manuscript_title }
                        onChange={ event => {
                                !wizard.isVerified && dispatch( handleIsVerified() );
                                dispatch( handleInput( { name: event.target.name, value: event.target.value } ) ) 
                            }
                        }
                    />
                    {
                        ( wizard.isVerified && formState.value?.manuscript_title === '' && !isValid.manuscript_title ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">You should enter a title for your manuscript</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

TypesStep.displayName = 'TypesStep';

export default TypesStep;