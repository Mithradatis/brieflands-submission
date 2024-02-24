'use client'

import SubmissionForm from '@/components/submission-form'
import NotPermission from '@/components/not-permission'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadStep,setWorkflowId } from '@/lib/features/wizard/wizardSlice'
import { usePathname } from 'next/navigation'
import { setLanguage, setIsInitialized } from '@/lib/features/wizard/wizardSlice'
import {
  getWorkflow,
  buildNewWorkflow,
  getSubmissionSteps, 
  getJournal,
  getUser 
} from '@/lib/api/client'
export default function Page({ params }: { params: { slug: string } }) {
  const dispatch: any = useDispatch();
  const wizard = useSelector( ( state: any ) => state.wizardSlice );
  const router = usePathname();
  const setWorkflowsId = () => {
    if (router === '/') {
      dispatch( setWorkflowId( process.env.DEFAULT_WORKFLOW_ID || '' ) );
    } else {
      const routerSegments = router.replace(/^\/|\/$/g, '').split('/');
      dispatch( setLanguage( routerSegments[0] ) );
      dispatch( setWorkflowId( routerSegments[3] ) );
    }
  };
  useEffect(() => {
    const initializeWorkflow = async () => {
      await setWorkflowsId();
      dispatch( setIsInitialized() );
    };
    initializeWorkflow();
  }, [router]);
  useEffect(() => {
    if ( wizard.isInitialized ) {
      if ( wizard.workflowId === '' ) {
        const buildNewWorkflowUrl = `${ process.env.SUBMISSION_API_URL }`;
        dispatch( buildNewWorkflow( buildNewWorkflowUrl ) );
      } else {
        const getWorkflowFromApi = `${process.env.SUBMISSION_API_URL}/${wizard.workflowId}`;
        dispatch(getWorkflow(getWorkflowFromApi)).then(() => {
          const getStepsFromApi = `${process.env.SUBMISSION_API_URL}/${wizard.workflowId}/steps`;
          dispatch( getSubmissionSteps( getStepsFromApi ) );
          wizard.currentStep !== '' && dispatch( loadStep( { currentStep: wizard.currentStep, isRefereshed: true } ) );
        });
      }
    }
  }, [wizard.isInitialized]);
  useEffect( () => {
      if ( wizard.workflow !== undefined && Object.keys( wizard.workflow ).length > 0 ) {
        const getJournalFromApi = `${ process.env.API_URL }/journal/journal/${ wizard.workflow.journal_id }`;
        dispatch( getJournal( getJournalFromApi ) );
        const getUserFromApi = `${ process.env.API_URL }/journal/profile`;
        dispatch( getUser( getUserFromApi ) );
      }
  }, [wizard.workflow]);

  return (
    <>
      <h2 className="d-block d-md-none w-100">
        { wizard.journal?.attributes?.title }
      </h2>
      {
        ( !wizard.workflow?.locked && wizard.workflowId !== '' && wizard.hasPermission )
          ? <SubmissionForm/>
          : <NotPermission message="You have not permission!"/>
      }
    </>
  )
}
