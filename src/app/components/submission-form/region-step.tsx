import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormLabel, FormControl, FormHelperText } from '@mui/joy'
import { wizardState, formValidator, handleIsVerified } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/regionSlice'
import { getRegions, getRegionStepData, getRegionStepGuide, updateRegionStepData } from '@/app/api/region'
import ReactHtmlParser from 'react-html-parser'

const RegionStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const regionsList = formState.regionsList;
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        id: true
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllEditorsFromApi = `${ wizard.baseUrl }/api/v1/journal/${ wizard.formStep }`;
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        dispatch( getRegions( getAllEditorsFromApi ) );
        dispatch( getRegionStepData( getStepDataFromApi ) );
        dispatch( getRegionStepGuide( getDictionaryFromApi ) );
    }, [wizard.formStep]);
    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect( () => {
        if ( wizard.isVerified ) {
            setIsValid(prevState => ({
                ...prevState,
                id: formState.value.id
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateRegionStepData( getStepDataFromApi ) );

          return true;
        }
    }));

    return (
        <>
            <div id="region" className="tab">
                <h3 className="mb-4 text-shadow-white">Region</h3>
                {
                    ( details !== undefined && details !== '' ) &&
                        <Alert severity="error" className="mb-4">
                            { ReactHtmlParser( details ) }
                        </Alert>
                }
                {   
                    formState.stepGuide !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                }
                <FormControl className="mb-3" error= { wizard.isVerified && formState.value.id === '' && !isValid.id }>
                    <FormLabel className="fw-bold mb-1">
                        Region
                    </FormLabel>
                    { regionsList ? (
                        <Autocomplete
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="region"
                            id="region"
                            options={ 
                                Array.isArray( regionsList ) 
                                ? regionsList.map( 
                                    ( item: any ) => {
                                        return item.attributes?.title || '' 
                                    }
                                   ) : []
                            }
                            value={
                                formState.value.id !== ''
                                  ? regionsList
                                      .find( ( item: any ) => formState.value.id === item.id )?.attributes?.title
                                  : null
                            }
                            onChange={(event, value) => {
                                !wizard.isVerified && dispatch( handleIsVerified() );
                                dispatch( handleInput({ 
                                        name: 'id',
                                        value: regionsList.find( 
                                            ( item: any ) => item.attributes.title === value )?.id || '' } 
                                            ) 
                                        )
                            }}
                        />
                        ) : (
                        <div>Loading regions...</div>
                    )}
                    {
                        ( wizard.isVerified && formState.value.id === '' && !isValid.id ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Please select a region</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

RegionStep.displayName = 'RegionStep';

export default RegionStep;