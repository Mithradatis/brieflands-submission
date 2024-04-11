import useMessageHandler from '@/app/services/messages';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { handleDialogClose } from '@features/dialog/dialogSlice';
import { useDeleteReviewerMutation } from '@/app/services/steps/reviewers';
import { useDeleteAuthorMutation } from '@/app/services/steps/authors';
import { useDeleteFileMutation, useReuseFileMutation } from '@/app/services/steps/files';
import { nextStep, setFormStep } from '@features/wizard/wizardSlice';
import {
  useFinishSubmissionMutation, 
  useLazyGetWorkflowQuery, 
  useLazyGetSubmissionStepsQuery, 
  useUpdateStepDataMutation 
} from '@/app/services/apiSlice';

const useHandleOperation = () => {
  const dispatch = useAppDispatch();
  const dialog = useAppSelector((state: any) => state.dialog);
  
  const { messageHandler } = useMessageHandler();
  const [ finishSubmissionTrigger ] = useFinishSubmissionMutation();
  const [ deleteAuthorTrigger ] = useDeleteAuthorMutation();
  const [ deleteReviewerTrigger ] = useDeleteReviewerMutation();
  const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
  const [ deleteFileTrigger ] = useDeleteFileMutation();
  const [ reuseFileTrigger ] = useReuseFileMutation();

  const handleOperation = async ( operation: string ) => {
    switch ( operation ) {
      case 'delete-author':
        await deleteAuthorTrigger(
          { 
            url: dialog.actions.deleteAuthor, 
            authorEmail: dialog.data 
          } 
        ).then( ( response: any ) => {
          messageHandler( 
            response, { 
                errorMessage: 'Failed to remove author', 
                successMessage: 'Author removed successfuly' 
            } 
          );
        });
        break;
      case 'delete-reviewer':
        await deleteReviewerTrigger( 
          { 
            url: dialog.actions.deleteReviewer, 
            reviewer: dialog.data 
          } 
        ).then( ( response: any ) => {
          messageHandler( 
            response, { 
                errorMessage: 'Failed to remove reviewer', 
                successMessage: 'Reviewer removed successfuly' 
            } 
        );
        });
        break;
      case 'delete-file':
        await deleteFileTrigger(
          { 
            url: dialog.actions.deleteFile, 
            uuid: dialog.data 
          }
        ).then( ( response: any ) => {
            messageHandler( 
                response, { 
                    errorMessage: 'Failed to delete file', 
                    successMessage: 'File removed successfuly' 
                } 
            );
        });
        break;
      case 'reuse-file':
        await reuseFileTrigger(
          { 
            url: dialog.actions.reuseFile, 
            uuid: dialog.data 
          }
        ).then( ( response: any ) => {
            messageHandler( 
                response, { 
                    errorMessage: 'Failed to reuse file', 
                    successMessage: 'File reused successfuly' 
                } 
            );
        });
        break;
      case 'proceed-submission':
        await updateStepDataTrigger( 
          { 
            url: dialog.actions.updateTypesStepData, 
            data: 'types' 
          } 
        );
        await useLazyGetWorkflowQuery( dialog.actions.getWorkflow );
        await useLazyGetSubmissionStepsQuery( dialog.actions.getSubmissionSteps );
        await dispatch(setFormStep('types'));
        dispatch(nextStep(dialog.actions.currentFormStep));
        break;
      case 'finish-submission':
        await finishSubmissionTrigger( dialog.actions.finishWorkflow );
        break;
    }
    dispatch(handleDialogClose());
  };

  return { handleOperation };
};

export default useHandleOperation;