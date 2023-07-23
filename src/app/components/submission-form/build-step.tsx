import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { Checkbox, FormControl, FormLabel, FormHelperText, Card, CardContent } from '@mui/joy'
import { stepState, handleCheckbox } from '@/app/features/submission/buildSlice'
import { getBuildStepGuide, getBuildStepData } from '@/app/api/build' 
import ReactHtmlParser from 'react-html-parser'

const BuildStep = () => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const [ isValid, setIsValid ] = useState({
        terms: true
    });
    useEffect( () => {
        if ( wizard.formStep === 'build' ) {
            const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
            const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
            dispatch( getBuildStepData( getStepDataFromApi ) );
            dispatch( getBuildStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useEffect(() => {
        if ( wizard.formStep === 'build' ) {
            const formIsValid = formState.value.terms;
            dispatch( formValidator( formIsValid ) );
        }
    }, [formState.value, wizard.formStep, wizard.workflow]);
    useEffect( () => {
        if ( wizard.formStep === 'build' ) {
            if ( wizard.isVerified ) {
                setIsValid(prevState => ({
                    ...prevState,
                    terms: formState.value.terms
                }));
            }
        }
    }, [wizard.isVerified]);

    return (
        <>
            <div id="build" className={`tab${wizard.formStep === 'build' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Build</h3>
                {   formState.stepGuide !== undefined &&     
                    <Alert severity="info" className="mb-4">
                        { ReactHtmlParser( formState.stepGuide ) }
                    </Alert>
                }
                <div className="d-flex align-items-center">
                    <div className="flex-fill w-50 pe-4">
                        <a href="#">
                            <Card variant="solid" color="primary" className="dashboard-stat pb-0 px-0 pt-4 mb-4">
                                <CardContent>
                                    <div className="overflow-hidden mb-3">
                                        <i className="dashboard-stat-icon fa-duotone fa-file-pdf text-white opacity-50"></i>
                                        <span className="fs-4 ps-5 pt-1 ms-3">Blind File</span>
                                    </div>
                                    <div className="dashboard-stat-footer text-light fs-7 px-3 py-1">
                                        <i className="fa-duotone fa-download me-1"></i>
                                        <span>Get File</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    </div>
                    <div className="flex-fill">
                        <a href="#">
                            <Card variant="solid" color="primary" className="dashboard-stat pb-0 px-0 pt-4 mb-4" sx={{ width: 320 }}>
                                <CardContent>
                                    <div className="overflow-hidden mb-3">
                                        <i className="dashboard-stat-icon fa-duotone fa-file-pdf text-white opacity-50"></i>
                                        <span className="fs-4 ps-5 pt-1 ms-3">Full File</span>
                                    </div>
                                    <div className="dashboard-stat-footer text-light fs-7 px-3 py-1">
                                        <i className="fa-duotone fa-download me-1"></i>
                                        <span>Get File</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    </div>
                </div>
                <form name="build-form" id="build-form">
                    <FormControl className="mb-4">
                        <Checkbox
                            required
                            name="terms"
                            id="terms"
                            label="I've read and agree to all terms that are mentioned above"
                            checked={ formState.value.terms || false }
                            onChange={ event => dispatch ( handleCheckbox( { name: event.target.name, value: formState.value.terms } ) ) }
                        />
                        {
                            ( !formState.value.ids && !isValid.terms )
                            && <div className="fs-7 text-danger">Please accept the terms and conditions</div> 
                        }
                    </FormControl>
                </form>
            </div>
        </>
    );
}

export default BuildStep;