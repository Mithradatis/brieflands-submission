import { useAppDispatch } from '@/app/store';
import { handleSnackbarOpen } from '@/lib/features/snackbar/snackbarSlice';

const useMessageHandler = () => {
  const dispatch = useAppDispatch();

  const messageHandler = (
    response: any,
    { errorMessage, successMessage }: { errorMessage: string; successMessage: string }
  ) => {
    if ( response.error ) {
      if (response.error?.status === 422) {
        const errorData = response.error.data;
        let message: any;
        if (errorData.data.hasOwnProperty('message')) {
          message = errorData.data.message;
          dispatch(handleSnackbarOpen({ severity: 'error', message: message }));
        }
        if (errorData.data.hasOwnProperty('errors')) {
          Object.entries(errorData.data.errors).map(([key, value]) => {
            const messages: any = value;
            dispatch(handleSnackbarOpen({ severity: 'error', message: messages[0] }));
          });
        }
      } else {
        dispatch(
          handleSnackbarOpen({
            severity: 'error',
            message: errorMessage,
            vertical: 'top',
            horizontal: 'center',
          })
        );
      }

      return null;
    }

    dispatch(
      handleSnackbarOpen({
        severity: 'success',
        message: successMessage,
      })
    );

    return null;
  };

  return { messageHandler };
};

export default useMessageHandler;