import { useAppDispatch } from '@/store/store'
import { handleSnackbarOpen } from '@/lib/features/snackbar/snackbarSlice'
import { handleModalSnackbarOpen } from '@/lib/features/snackbar/modalSnackbarSlice'

const useMessageHandler = () => {
  const dispatch = useAppDispatch();

  const messageHandler = (
    response: any,
    { errorMessage, successMessage }: { errorMessage: string; successMessage: string },
    isModal: boolean = false,
  ) => {
    if ( response.error ) {
      if ( response.error?.status === 422 ) {
        const errorData = response.error.data;
        let message: any;
        if ( errorData.data.hasOwnProperty('message') ) {
          message = errorData.data.message;
          if ( isModal ) {
            dispatch(
              handleModalSnackbarOpen(
                { 
                  severity: 'error', 
                  message: message
                }
              )
            );
          } else {
            dispatch(
              handleSnackbarOpen(
                { 
                  severity: 'error', 
                  message: message 
                }
              )
            );
          }
        }
        if ( errorData.data.hasOwnProperty('errors') ) {
          Object.entries(errorData.data.errors).map(( [ key, value ] ) => {
            const messages: any = value;
            if ( isModal ) {
              dispatch(
                handleModalSnackbarOpen(
                  { 
                    severity: 'error', 
                    message: messages[0] 
                  }
                )
              );
            } else {
              dispatch( 
                handleSnackbarOpen( 
                  { 
                    severity: 'error', 
                    message: messages[0] 
                  } 
                ) 
              );
            }
          });
        }
      } else {
        if ( isModal ) {
          dispatch(
            handleModalSnackbarOpen(
              { 
                severity: 'error',
                message: errorMessage,
                vertical: 'top',
                horizontal: 'center',
              }
            )
          );
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
      }
      console.error( errorMessage );

      return false;
    }
    if ( isModal ) {
      dispatch(
        handleModalSnackbarOpen(
          { 
            severity: 'success',
            message: successMessage,
          }
        )
      );
    } else {
      dispatch(
        handleSnackbarOpen({
          severity: 'success',
          message: successMessage,
        })
      );
    }

    return false;
  };

  return { messageHandler };
};

export default useMessageHandler;