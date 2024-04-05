import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useQuery } from '@tanstack/react-query'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator, Wizard } from '@features/wizard/wizardSlice'
import { Alert } from '@mui/material'
import { getStepData, getStepGuide } from '@api/client'
import { 
    handleLoading, 
    setStepData, 
    setStepGuide, 
    Zero 
} from '@features/submission/steps/zero/zeroSlice'

const ZeroStep = forwardRef(
    ( 
        props: { 
            apiUrls: { stepDataApiUrl: string, stepGuideApiUrl: string }, 
            details: string 
        }, 
        ref 
    ) => {
    const dispatch: ThunkDispatch<any, void, any> = useDispatch();
    const formState: Zero = useSelector( ( state: any ) => state.zero );
    const wizard: Wizard = useSelector( ( state: any ) => state.wizard );
    useEffect( () => {
        dispatch( formValidator( true ) );
    }, []);
    useQuery({
        queryKey: ['zeroStepGuide'],
        queryFn: async () => {
            const response = await dispatch( getStepGuide( props.apiUrls.stepGuideApiUrl ) );
            const payload = response.payload;
            dispatch( setStepGuide( payload ) );

            return payload;
        },
        enabled: typeof wizard.workflowId === 'string',
        gcTime: wizard.cacheDuration
    });
    useQuery({
        queryKey: ['zeroStepData'],
        queryFn: async () => {
            const response = await dispatch( getStepData( props.apiUrls.stepDataApiUrl ) );
            const payload = response.payload;
            dispatch( setStepData( payload ) );

            return payload;
        },
        enabled: typeof wizard.workflowId === 'string',
        gcTime: wizard.cacheDuration
    });
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = true;  
          
          return isAllowed;
        }
    }));

    return (
        <>
            <StepPlaceholder visibility={ formState.isLoading || typeof formState.stepGuide !== 'string' } />
            <div 
                id="zero" 
                className={ `tab ${ 
                    ( formState.isLoading || typeof formState.stepGuide !== 'string' ) 
                        ? ' d-none' 
                        : ' d-block' 
                    }` 
                }
            >
                <h3 className="mb-4 text-shadow-white">
                    Revise/Revission Message
                </h3>
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