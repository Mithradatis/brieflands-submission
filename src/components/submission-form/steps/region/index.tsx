import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Skeleton } from '@mui/material'
import { Autocomplete, FormLabel, FormControl, FormHelperText } from '@mui/joy'
import { formValidator, handleIsVerified } from '@/lib/features/wizard/wizardSlice'
import { handleInput, handleLoading } from '@/lib/features/submission/steps/region/regionSlice'
import { 
    getRegions, 
    getRegionStepData, 
    getRegionStepGuide, 
    updateRegionStepData 
} from '@/lib/api/steps/region'

const RegionStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.regionSlice );
    const regionsList = formState.regionsList;
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const [ isValid, setIsValid ] = useState({
        id: true
    });
    const details = wizard.screeningDetails?.find( ( item: any ) => 
        ( item.attributes?.step_slug === wizard.formStep && item.attributes?.status === 'invalid' ) )?.attributes?.detail || '';
    const getAllEditorsFromApi = `${ process.env.API_URL }/journal/${ wizard.formStep }`;
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/${ wizard.formStep }`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'region' ) {
            dispatch( getRegions( getAllEditorsFromApi ) );
            dispatch( getRegionStepData( getStepDataFromApi ) );
            dispatch( getRegionStepGuide( getDictionaryFromApi ) );
        }
    }, []);
    useEffect(() => {
        const formIsValid = Object.values( formState.value ).every(value => value !== '');
        dispatch( formValidator( formIsValid ) );
    }, [wizard.formStep, formState.value]);
    useEffect( () => {
        if ( wizard.isVerified ) {
            setIsValid(prevState => ({
                ...prevState,
                id: formState.value?.id
            }));
        }
    }, [formState.value, wizard.isVerified]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = false;   
          try {
            await dispatch( updateRegionStepData( getStepDataFromApi ) );
            
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
            <div id="region" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Region</h3>
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
                <FormControl className="mb-3" error= { wizard.isVerified && formState.value?.id === '' && !isValid.id }>
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
                                ( formState.value?.id !== '' && regionsList.length > 0 )
                                  ? regionsList
                                      .find( ( item: any ) => formState.value?.id === item.id )?.attributes?.title
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
                        ( wizard.isVerified && formState.value?.id === '' && !isValid.id ) 
                        && <FormHelperText className="fs-7 text-danger mt-1">Please select a region</FormHelperText> 
                    }
                </FormControl>
            </div>
        </>
    );
});

RegionStep.displayName = 'RegionStep';

export default RegionStep;