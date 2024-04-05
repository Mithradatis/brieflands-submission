import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import * as ReactDOMServer from 'react-dom/server'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import { Autocomplete, FormHelperText, Input, FormLabel, FormControl } from '@mui/joy'
import { handleDialogOpen } from '@features/dialog/dialogSlice'
import { Type } from '@/app/services/types'
import { Value } from '@/app/services/types/types'
import { formValidator, setHasTypeDetermined } from '@features/wizard/wizardSlice'
import { shouldStepUpdate } from '@/app/services/validators'
import {
    useGetStepDataQuery, 
    useGetStepGuideQuery,
    useLazyGetSameArticlesQuery,
    useLazyGetSameArticlesGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'

const TypesStep = forwardRef(
    ( 
        props: { 
            apiUrls: { 
                stepDataApiUrl: string, 
                stepGuideApiUrl: string,
            },
            details: string,
            workflowId: string,
            types: Type[]
        }, 
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const formStep = useAppSelector( ( state: any ) => state.wizard.formStep );
    const [formData, setFormData] = useState<Value>({
        doc_type: '',
        manuscript_title: ''
    });
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    const [getSameArticlesTrigger] = useLazyGetSameArticlesQuery();
    const [getSameArticlesGuideTrigger] = useLazyGetSameArticlesGuideQuery();
    const isLoading: boolean = ( stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' )
    const getSameArticlesFromApi = `${ props.workflowId }/type/same_articles`;
    const getSameArticlesGuideFromApi = 'dictionary/get/journal.submission.similar_article';
    useEffect( () => {
        if ( 
            stepData && 
            typeof stepData === 'object' && 
            Object.keys( stepData ).length > 0 
        ) {
            setFormData( stepData );
        }
    }, [stepData]);
    useEffect( () => {
        const formIsValid = Object.values( formData ).every( 
            ( value: string ) => value !== ''
        );
        dispatch( formValidator( formIsValid ) );
    }, [formData]);
    useImperativeHandle( ref, () => ({
        async submitForm() {
          let isAllowed = false;
          try {
            if ( shouldStepUpdate( stepData, formData ) ) {
                await getSameArticlesTrigger(
                    {
                        url: getSameArticlesFromApi,
                        documentDetails: {
                            doc_type: formData?.doc_type,
                            manuscript_title: formData?.manuscript_title
                        }
                    }
                ).then( async ( data: any ) => {
                    const sameArticles = data.payload;
                    await getSameArticlesGuideTrigger( getSameArticlesGuideFromApi ).then( async ( data: any ) => {
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
                                        updateTypesStepData: props.apiUrls.stepDataApiUrl, 
                                        currentFormStep: formStep
                                    },
                                    approvePhrase: 'Proceed',
                                    denyPhrase: 'Cancel',
                                    dialogTitle: 'Same Articles', 
                                    dialogContent: { 
                                        content: ReactDOMServer.renderToString( sameArticlesTable ) 
                                    },
                                    dialogAction: 'proceed-submission'
                                } 
                            ));
                            isAllowed = false;
                        } else {
                            isAllowed = true;
                            await updateStepDataTrigger( 
                                { 
                                    url: props.apiUrls.stepDataApiUrl, 
                                    data: formData
                                }
                            );
                            dispatch( setHasTypeDetermined() );
                        }    
                    });
                });
            } else {
                isAllowed = true;
            }
          } catch ( error ) {
            console.error("Error while submitting form:", error);
          }

          return isAllowed;
        },
    }));

    return (
        <>
            {
                isLoading
                    ? <StepPlaceholder />
                    : <div 
                        id="types" 
                        className="tab"
                    >
                        <h3 className="mb-4 text-shadow-white">Types</h3>
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
                                isVerified && 
                                ( 
                                    !formData?.doc_type || 
                                    formData?.doc_type === '' 
                                )
                            }
                        >
                            <FormLabel className="fw-bold mb-1">
                                Manuscript Type
                            </FormLabel>
                            { props.types ? (
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
                                        Array.isArray( props.types ) 
                                        ? props.types.map( 
                                            item => {
                                                return item.attributes?.title || '' 
                                            }
                                        ) : []
                                    }
                                    value={
                                        ( 
                                            formData?.hasOwnProperty( 'doc_type' ) && 
                                            formData?.doc_type !== '' 
                                        )
                                        ? props.types?.find( ( item: any ) => 
                                                parseInt( item.id ) === parseInt( formData?.doc_type ) )?.attributes?.title
                                        : null
                                    }
                                    onChange={ ( event, value ) => {
                                        setFormData(
                                            ( prevState: any ) => ({ 
                                                ...prevState, 
                                                doc_type: props.types.find( 
                                                    ( item: any ) => item.attributes.title === value )?.id || '' 
                                            })
                                        )
                                    }}
                                />
                                ) : (
                                <div>
                                    Loading document types...
                                </div>
                            )}
                            {
                                ( 
                                    isVerified && 
                                    ( 
                                        !formData?.doc_type || 
                                        formData?.doc_type === '' 
                                    )
                                ) && 
                                    <FormHelperText className="fs-7 text-danger mt-1">
                                        You should select a document type
                                    </FormHelperText> 
                            }
                        </FormControl>
                        <FormControl 
                            className="mb-3 required" 
                            error={ 
                                isVerified && 
                                ( 
                                    !formData?.manuscript_title || 
                                    formData?.manuscript_title === '' 
                                )
                            }
                        >
                            <FormLabel className="fw-bold mb-1">
                                Title
                            </FormLabel>
                            <Input
                                required
                                variant="soft"
                                name="manuscript_title"
                                id="manuscript_title"
                                placeholder="Manuscript Title"
                                value={ formData?.manuscript_title || '' }
                                onChange={ event => {
                                        setFormData(
                                            ( prevState: any ) => ({ 
                                                ...prevState, 
                                                manuscript_title: event.target.value
                                            }) 
                                        ) 
                                    }
                                }
                            />
                            {
                                ( 
                                    isVerified && 
                                    ( 
                                        !formData?.manuscript_title || 
                                        formData?.manuscript_title === '' 
                                    )
                                ) && 
                                    <FormHelperText className="fs-7 text-danger mt-1">
                                        You should enter a title for your manuscript
                                    </FormHelperText> 
                            }
                        </FormControl>
                    </div>
            }
        </>
    );
});

TypesStep.displayName = 'TypesStep';

export default TypesStep;