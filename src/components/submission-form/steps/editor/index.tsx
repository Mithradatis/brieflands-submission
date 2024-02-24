import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormLabel, FormControl } from '@mui/joy'
import { formValidator } from '@/lib/features/wizard/wizardSlice'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/editor/editorSlice'
import { 
    getEditors, 
    getEditorStepData, 
    getEditorStepGuide, 
    updateEditorStepData 
} from '@/lib/api/steps/editor'

const EditorStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.editorSlice );
    const editorsList = formState.editorsList;
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllEditorsFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/editor/get_all`;
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/editor`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'editor' ) {
            dispatch( getEditors( getAllEditorsFromApi ) );
            dispatch( getEditorStepData( getStepDataFromApi ) );
            dispatch( getEditorStepGuide( getDictionaryFromApi ) );
            dispatch( formValidator( true ) );
        }
    }, []);
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
                                ( formState.value?.id !== '' && editorsList.length > 0 )
                                ? editorsList
                                    .find( ( item: any ) => formState.value?.id === item.id )?.name
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