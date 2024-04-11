import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch } from '@/app/store'
import { Alert } from '@mui/material'
import { Autocomplete, FormLabel, FormControl } from '@mui/joy'
import { formValidator } from '@features/wizard/wizardSlice'
import { useGetEditorsQuery } from '@/app/services/steps/editor'
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation
} from '@/app/services/apiSlice'

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
    const [ formData, setFormData ] = useState({
        id: ''
    });
    const getAllTypesFromApi = `${ process.env.SUBMISSION_API_URL }/${ props.workflowId }/editor/get_all`;
    const { data: editors, isLoading: editorsIsLoading } = useGetEditorsQuery( getAllTypesFromApi );
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading, error } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( editorsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    useEffect(() => {
        dispatch( formValidator( true ) );
    }, []);
    useEffect(() => {
        if ( stepData ) {
            setFormData({
                id: stepData.id
            });
        }
    }, [stepData]);
    useImperativeHandle(ref, () => ({
        async submitForm () {  
          let isAllowed = false;   
          try {
            await updateStepDataTrigger( 
                { 
                    url: props.apiUrls.stepDataApiUrl, 
                    data: formData 
                } 
            );
            isAllowed = true;
          } catch ( error ) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));

    return (
        isLoading
            ? <StepPlaceholder/>
            :
                <div id="editors" className="tab">
                    <h3 className="mb-4 text-shadow-white">Editor</h3>
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
                    <FormControl className="mb-3">
                        <FormLabel className="fw-bold mb-1">
                            Editor
                        </FormLabel>
                        { editors ? (
                            <Autocomplete
                                color="neutral"
                                size="md"
                                variant="soft"
                                placeholder="Choose one…"
                                disabled={false}
                                name="editor"
                                id="editor"
                                options={ 
                                    Array.isArray( editors ) 
                                    ? editors.map( 
                                        item => {
                                            return `${ 
                                                item.attributes.first_name 
                                            } ${ 
                                                item.attributes.middle_name 
                                            } ${ 
                                                item.attributes.last_name 
                                            }` || '' 
                                        }
                                    ) : []
                                }
                                value={
                                    ( formData?.id !== '' && editors.length > 0 )
                                    ? editors
                                        .find( ( item: any ) => formData?.id === item.id )?.name
                                    : null
                                }
                                onChange={(event, value) => {
                                    setFormData({ 
                                        id: editors.find( 
                                            ( item: any ) => `${ 
                                                item.attributes.first_name 
                                            } ${ 
                                                item.attributes.middle_name 
                                            } ${ 
                                                item.attributes.last_name 
                                            }` === value )?.id || '' } 
                                    )
                                }}
                            />
                            ) : (
                            <div>Loading editors...</div>
                        )}
                    </FormControl>
                </div>
    );
});

EditorStep.displayName = 'EditorStep';

export default EditorStep;