import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from '@mui/material'
import { Autocomplete, FormLabel, FormControl } from '@mui/joy'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/regionSlice'
import { getRegions, getRegionStepData, getRegionStepGuide, updateRegionStepData } from '@/app/api/region'
import ReactHtmlParser from 'react-html-parser'

const RegionStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const regionsList = formState.regionsList;
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        ids: true
    });
    const getAllEditorsFromApi = `http://apcabbr.brieflands.com.test/api/v1/journal/${ wizard.formStep }`;
    const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
    const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'region' ) {
            dispatch( getRegions( getAllEditorsFromApi ) );
            dispatch( getRegionStepData( getStepDataFromApi ) );
            dispatch( getRegionStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'region' ) {
            const formIsValid = formState.value.terms;
            dispatch( formValidator( formIsValid ) );
        }
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect( () => {
        if ( wizard.formStep === 'region' ) {
            if ( wizard.isVerified ) {
                setIsValid(prevState => ({
                    ...prevState,
                    ids: formState.value.terms
                }));
            }
        }
    }, [wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateRegionStepData( getStepDataFromApi ) );
        }
    }));

    return (
        <>
            <div id="region" className={`tab${wizard.formStep === 'region' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Region</h3>
                {   
                    formState.stepGuide !== undefined &&
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                }
                <FormControl className="mb-3">
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
                </FormControl>
            </div>
        </>
    );
});

export default RegionStep;