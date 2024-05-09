'use client'

import SubmissionForm from '@/components/submission-form'
import NotPermission from '@/components/not-permission'
import NotFound from './404'
import PageLoading from './loading'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FormStep } from '@/app/services/types'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  setHasTypeDetermined,
  setCurrentStep,
  setJournal,
  setSubmissionSteps,
  setWorkflowId
} from '@/app/features/wizard/wizardSlice'
import {
  useBuildNewWorkflowMutation,
  useLazyGetWorkflowQuery,
  useLazyGetJournalQuery,
  useLazyGetSubmissionStepsQuery
} from '@/app/services/apiSlice'

export default function Page({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  const formSteps = useAppSelector((state: any) => state.wizard.formSteps);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workflowStatus, setWorkflowStatus] = useState<string | undefined>(undefined);
  const [buildNewWorkflow] = useBuildNewWorkflowMutation();
  const [
    getWorkflowQueryTrigger,
    {
      data: workflow,
      isLoading: workflowIsLoading,
      isError: workflowHasError,
      error: workflowError
    }
  ] = useLazyGetWorkflowQuery();
  const [getSubmissionsTrigger] = useLazyGetSubmissionStepsQuery();
  const [getJournalTrigger] = useLazyGetJournalQuery();
  const router = usePathname();
  let workflowId = '';
  if (router === '/') {
    workflowId = process.env.DEFAULT_WORKFLOW_ID || '';
  } else {
    const routerSegments = router.replace(/^\/|\/$/g, '').split('/');
    workflowId = routerSegments[3] || '';
  }
  const handleFormSteps = async (steps: FormStep[]) => {
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
    if (workflow?.hasOwnProperty('document_id') &&
      workflow.document_id !== null &&
      workflow.document_id !== 0
    ) {
      isRevised = true;
    }
    if (isRevision || isRevised) {
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
    await dispatch(setSubmissionSteps(formSteps));
  }
  useEffect(() => {
    const activeTab = window.location.hash.substring(1) || process.env.DEFAULT_STEP;
    dispatch(setCurrentStep(activeTab));
    const handleWorkflow = async () => {
      if (workflowId !== '') {
        const response = await getWorkflowQueryTrigger(workflowId);
        setWorkflowStatus( response.status );
      } else {
        const newWorkflow = await buildNewWorkflow();
        window.location.href = `${process.env.REDIRECT_URL !== undefined
          ? process.env.REDIRECT_URL
          : process.env.SUBMISSION_API_URL}/${newWorkflow.data.id}`;
      }
    }
    handleWorkflow();
  }, []);
  useEffect(() => {
    const setWorkflowsId = async () => {
      if ( workflowStatus ) {
        if ( workflowStatus === 'rejected' ) {
          await setIsLoading( false );
        } else {
          if (workflow && !workflowIsLoading && !workflowHasError) {
            await dispatch(setWorkflowId(workflow.id));
            if (
              workflow?.attributes?.storage?.types?.doc_type !== undefined &&
              workflow?.attributes?.storage?.types?.doc_type !== ''
            ) {
              await dispatch(setHasTypeDetermined());
            }
            const steps = await getSubmissionsTrigger(`${workflow.id}/steps`).then(
              (response: any) => response.data
            );
            await handleFormSteps(steps);
            const journal = await getJournalTrigger(
              `journal/journal/${workflow.attributes.journal_id}`
            ).then(
              (response: any) => response.data
            );
            await dispatch(setJournal(journal));
            await setIsLoading( false );
          }
        }
      }
    };
    setWorkflowsId();
  }, [workflow, workflowStatus]);

  return (
    isLoading
      ? <PageLoading />
      : workflowHasError
        ? (() => {
          return (
            workflowError.status === 'FETCH_ERROR' || workflow?.locked
              ? <NotPermission message="You have no permission" />
              : workflowError.status === 'PARSING_ERROR'
                ? <NotFound />
                : null
          );
        })()
        : (
          ( workflow && formSteps && formSteps.length > 0 ) &&
          <SubmissionForm workflow={workflow} />
        )
  );
}
