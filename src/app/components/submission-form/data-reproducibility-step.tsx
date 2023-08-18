import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { FormControl, FormLabel, Textarea } from '@mui/joy'
import { stepState, handleInput } from '@/app/features/submission/dataReproducibilitySlice'
import { getDataReproducibilityStepGuide, getDataReproducibilityStepData, updateDataReproducibilityStepData } from '@/app/api/dataReproducibility' 
import ReactHtmlParser from 'react-html-parser'

const DataReproducibilityStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect( () => {
        dispatch( getDataReproducibilityStepData( getStepDataFromApi ) );
        dispatch( getDataReproducibilityStepGuide( getDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateDataReproducibilityStepData( getStepDataFromApi ) );

          return true;
        }
    }));

    return (
        <>
            <div id="data-reproducibility" className="tab">
                <h3 className="mb-4 text-shadow-white">Data Reroducibility</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <FormControl className="mb-3">
                    <FormLabel className="fw-bold mb-1">
                        Data Reroducibility
                    </FormLabel>
                    <Textarea
                        variant="soft"
                        name="dataReproducibility"
                        id="dataReproducibility"
                        className="rounded"
                        aria-label="textarea"
                        placeholder="Enter your text here"
                        minRows={4}
                        maxRows={10}
                        defaultValue={ formState.value?.text ? formState.value.text : '' }
                        onChange={( event: any ) => {
                            dispatch( handleInput( event.target.value ) );
                        }}
                    />
                </FormControl>
            </div>
        </>
    );
});

DataReproducibilityStep.displayName = 'DataReproducibilityStep';

export default DataReproducibilityStep;