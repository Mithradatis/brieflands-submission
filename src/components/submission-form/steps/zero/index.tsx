import ReactHtmlParser from 'react-html-parser'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator } from '@/lib/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { handleLoading } from '@/lib/features/submission/steps/zero/zeroSlice'
import { getZeroStepGuide, getZeroStepData } from '@/lib/api/steps/zero' 

const ZeroStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( ( state: any ) => state.zeroSlice );
    const wizard = useSelector( ( state: any ) => state.wizardSlice );
    const getStepDataFromApi = `${ process.env.SUBMISSION_API_URL }/${ wizard.workflowId }/zero`;
    const getDictionaryFromApi = `${ process.env.DICTIONARY_API_URL }/journal.submission.step.${ wizard.formStep}`;
    useEffect( () => {
        dispatch( getZeroStepData( getStepDataFromApi ) );
        dispatch( getZeroStepGuide( getDictionaryFromApi ) );
        dispatch( formValidator( true ) );
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = true;  
          
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
            <div id="zero" className={ `tab ${ ( formState.isLoading || typeof formState.stepGuide !== 'string' ) ? ' d-none' : ' d-block' }` }>
                <h3 className="mb-4 text-shadow-white">Revise/Revission Message</h3>
                {
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' && (
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                    )
                }
                <Alert severity="info" className="mb-4 break-word">
                    { formState.value?.revise_message !== undefined 
                        && ReactHtmlParser( formState.value?.revise_message )
                    }
                    { formState.value?.screening !== undefined &&
                        <table className="fs-7 table table-bordered table-stripped table-responsive">
                            <thead>
                                <tr>
                                    <th>Step Title</th>
                                    <th>Status</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    formState.value?.screening.map( ( row: any, index: number ) =>
                                        <tr key={ `row-${ index }` }>
                                            <td>{ row.step_title }</td>
                                            <td>{ row.status }</td>
                                            <td>{ ReactHtmlParser( row.detail ) }</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table> 
                    }
                </Alert>
            </div>
        </>
    );
});

ZeroStep.displayName = 'ZeroStep';

export default ZeroStep;