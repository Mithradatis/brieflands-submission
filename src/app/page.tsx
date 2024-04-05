'use client'

import SubmissionForm from '@/components/submission-form'
import NotPermission from '@/components/not-permission'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FormStep } from '@/app/services/types'
import { 
  handleLoading,
  setHasTypeDetermined, 
  setCurrentStep, 
  setJournal, 
  setSubmissionSteps,
  setWorkflowId
} from '@features/wizard/wizardSlice'
import {
  useBuildNewWorkflowMutation,
  useGetWorkflowQuery,
  useLazyGetJournalQuery, 
  useLazyGetSubmissionStepsQuery
} from '@/app/services/apiSlice'
import { useAppDispatch, useAppSelector } from '@/app/store'
import NotFound from './404'

export default function Page({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  const formSteps = useAppSelector( (state: any) => state.wizard.formSteps );
  const [buildNewWorkflow] = useBuildNewWorkflowMutation();
  const [getSubmissionsTrigger] = useLazyGetSubmissionStepsQuery();
  const [getJournalTrigger] = useLazyGetJournalQuery();
  const router = usePathname();
  let workflowId = '';
  if (router === '/') {
    workflowId = process.env.DEFAULT_WORKFLOW_ID || '';
  } else {
    const routerSegments = router.replace(/^\/|\/$/g, '').split('/');
    workflowId = routerSegments[3];
  }
  const { data: workflow, isLoading, isError, error } = useGetWorkflowQuery( workflowId );
  const handleFormSteps = async ( steps: FormStep[] ) => {
    let formSteps: FormStep[] = steps;
    let isRevised: boolean = false;
    let isRevision: boolean = false;
    if ( 
      workflow?.attributes?.storage?.hasOwnProperty('revision') && 
      workflow.attributes.storage?.revision !== null && 
      workflow.attributes.storage?.revision > 0 
    ) {
      isRevision = true;
    }
    if ( workflow?.hasOwnProperty('document_id') && 
      workflow.document_id !== null && 
      workflow.document_id !== 0 
    ) {
      isRevised = true;
    }
    if ( isRevision || isRevised ) {
      formSteps.unshift( 
        { 
          id: '0', 
          attributes: { 
            title: 'Revision Message', 
            slug: 'revision_message', 
            subSteps: []
          } 
        } 
      );
    }
    await dispatch( setSubmissionSteps( formSteps ) );
  }
  useEffect(() => {
    const activeTab = window.location.hash.substring(1) || process.env.DEFAULT_STEP;
    dispatch( setCurrentStep( activeTab ) );
  }, []);
  useEffect(() => {
    dispatch( handleLoading( true ) );
    const setWorkflowsId = async () => {
      if ( workflow ) {
        dispatch( setWorkflowId( workflow.id ) );
        if ( 
          workflow?.attributes?.storage?.types?.doc_type !== undefined && 
          workflow?.attributes?.storage?.types?.doc_type !== '' 
        ) {
          await dispatch( setHasTypeDetermined() );
        }
        const steps = await getSubmissionsTrigger(`${ workflow.id }/steps`).then( 
          ( response: any ) => response.data 
        );
        await handleFormSteps( steps );
        const journal = await getJournalTrigger( `journal/journal/${ workflow.attributes.journal_id }` ).then( 
          ( response: any ) => response.data );
        await dispatch( setJournal( journal ) );
      }
      if ( workflowId === '' ) {
        const newWorkflow = await buildNewWorkflow( process.env.SUBMISSION_API_URL );
        window.location.href = `${ process.env.REDIRECT_URL !== undefined 
          ? process.env.REDIRECT_URL 
          : process.env.SUBMISSION_API_URL }/${ newWorkflow?.id }`;
      }
      dispatch( handleLoading( false ) );
    };
    if ( workflow && !isLoading && !isError ) {
      setWorkflowsId();
    }
  }, [workflow]);

  return (
    isError
      ? (() => {
        dispatch(handleLoading(false));
        return (
          error.status === 'FETCH_ERROR' ? <NotPermission message="You have no permission" /> :
          error.status === 'PARSING_ERROR' ? <NotFound /> :
          null
        );
      })()
      : (
        workflow && formSteps.length > 0 && !workflow?.locked ? (
          <SubmissionForm workflow={workflow} />
        ) : (
          <NotPermission message="You have no permission" />
        )
      )
  );
}
