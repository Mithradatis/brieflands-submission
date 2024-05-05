import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formValidator } from '@/app/features/wizard/wizardSlice'
import { Alert, Box, Typography } from '@mui/material'
import { handleLoading, Zero } from '@features/submission/steps/zero/zeroSlice'

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
    useEffect( () => {
        dispatch( formValidator( true ) );
    }, []);
    useImperativeHandle(ref, () => ({
        async submitForm () {
          dispatch( handleLoading( true ) );  
          let isAllowed = true;  
          
          return isAllowed;
        }
    }));

    return (
        <>
            <StepPlaceholder/>
            <Box 
                className={ `tab ${ 
                    ( formState.isLoading || typeof formState.stepGuide !== 'string' ) 
                        ? ' hidden'
                        : ' block' 
                    }` 
                }
            >
                <Typography variant="h3" mb={2}>
                    Revise/Revission Message
                </Typography>
                {
                    typeof formState.stepGuide === 'string' && formState.stepGuide.trim() !== '' && (
                        <Alert color="info" className="mb-4">
                            { ReactHtmlParser( formState.stepGuide ) }
                        </Alert>
                    )
                }
                <Alert color="info" className="mb-4 break-word">
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
            </Box>
        </>
    );
});

ZeroStep.displayName = 'ZeroStep';

export default ZeroStep;