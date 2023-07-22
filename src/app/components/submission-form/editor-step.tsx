import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormLabel, FormControl } from '@mui/joy'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/editorSlice'
import { getEditors, getEditorStepData, getEditorStepGuide } from '@/app/api/editor'
import ReactHtmlParser from 'react-html-parser'

const EditorStep = () => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const editorsList = formState.editorsList;
    const wizard = useSelector( wizardState );
    useEffect(() => {
        if ( wizard.formStep === 'editor' ) {
            const getAllEditorsFromApi = `http://apcabbr.brieflands.com.test/api/v1/journal/${ wizard.formStep }`;
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getEditors( getAllEditorsFromApi ) );
            dispatch( getEditorStepData( getStepDataFromApi ) );
            dispatch( getEditorStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);

    return (
        <>
            <div id="editor" className={`tab${wizard.formStep === 'editor' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Editor</h3>
                {   
                    formState.stepGuide !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
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
                                    ( item: any ) => {
                                        return item.attributes?.title || '' 
                                    }
                                   ) : []
                            }
                            value={
                                formState.value.id !== ''
                                  ? editorsList
                                      .find( ( item: any ) => formState.value.id === item.id )?.attributes?.title
                                  : null
                            }
                            onChange={(event, value) => {
                                dispatch( handleInput({ 
                                        name: 'id',
                                        value: editorsList.find( 
                                            ( item: any ) => item.attributes.title === value )?.id || '' } 
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
}

export default EditorStep;