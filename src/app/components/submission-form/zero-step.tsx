import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { wizardState, formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert, Skeleton } from '@mui/material'
import { stepState, handleLoading } from '@/app/features/submission/zeroSlice'
import { getZeroStepGuide, getZeroStepData } from '@/app/api/zero' 
import ReactHtmlParser from 'react-html-parser'

const ZeroStep = forwardRef( ( prop, ref ) => {
    const dispatch: any = useDispatch();
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const getStepDataFromApi = `${ wizard.baseUrl }/api/v1/submission/workflow/${ wizard.workflowId }/zero`;
    const getDictionaryFromApi = `${ wizard.baseUrl }/api/v1/dictionary/get/journal.submission.step.${ wizard.formStep}`;
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
                    { formState.value.revise_message !== undefined 
                        && ReactHtmlParser( formState.value.revise_message )
                    }
                    { formState.value.screening !== undefined &&
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
                                    formState.value.screening.map( ( row: any, index: number ) =>
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