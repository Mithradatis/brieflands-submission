import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormLabel, FormControl } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput, handleLoading } from '@/app/features/submission/editorSlice'
import { getEditors, getEditorStepData, getEditorStepGuide, updateEditorStepData } from '@/app/api/editor'
import ReactHtmlParser from 'react-html-parser'

const EditorStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const editorsList = formState.editorsList;
    const wizard = useSelector( wizardState );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllEditorsFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/editor/get_all`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/editor`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        dispatch( getEditors( getAllEditorsFromApi ) );
        dispatch( getEditorStepData( getStepDataFromApi ) );
        dispatch( getEditorStepGuide( getDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await dispatch( updateEditorStepData( getStepDataFromApi ) );
            
            isAllowed = true;
          } catch (error) {
            console.error("Error while submitting form:", error);
          }  
          
          return isAllowed;
        }
    }));

    return (
        <>
            <div className={ `step-loader ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-block' : ' d-none' }` }>
                <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
                <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
            </div>
            <div id="editors" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Editor</h3>
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
                <FormControl className="mb-3">
                    <FormLabel className="fw-bold mb-1">
                        Editor
                    </FormLabel>
                    { editorsList ? (
                        <Autocomplete
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="editor"
                            id="editor"
                            options={ 
                                Array.isArray( editorsList ) 
                                ? editorsList.map( 
                                    item => {
                                        return item.name || '' 
                                    }
                                ) : []
                            }
                            value={
                                formState.value.id !== ''
                                ? editorsList
                                    .find( ( item: any ) => formState.value.id === item.id )?.name
                                : null
                            }
                            onChange={(event, value) => {
                                dispatch( handleInput({ 
                                        name: 'id',
                                        value: editorsList.find( 
                                            ( item: any ) => item.name === value )?.id || '' } 
                                            ) 
                                        )
                            }}
                        />
                        ) : (
                        <div>Loading editors...</div>
                    )}
                </FormControl>
            </div>
        </>
    );
});

EditorStep.displayName = 'EditorStep';

export default EditorStep;