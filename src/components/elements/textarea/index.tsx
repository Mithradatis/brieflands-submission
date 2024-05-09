import { useState } from 'react'
import { useAppDispatch } from '@/store/store'
import { handleSnackbarOpen } from '@/lib/features/snackbar/snackbarSlice'
import { 
    Box, 
    FormControl, 
    FormHelperText, 
    FormLabel, 
    TextField, 
    Typography 
} from '@mui/material'

const Textarea = (
    {
        label,
        value,
        onChange,
        fieldName,
        required,
        error,
        wordCountLimit
    }: {
        label: string,
        value: any,
        onChange: any,
        fieldName?: string,
        required?: boolean,
        error?: boolean,
        wordCountLimit?: number | undefined
    }
) => {
    const dispatch = useAppDispatch();
    const [wordCount, setWordCount] = useState(0);
    const countValidation = (value: string, maximumWordCount?: number) => {
        if (maximumWordCount) {
            const wordsCount: number = value.trim().split(/\s+/).length;
            setWordCount(wordsCount);
            const wordCounter = document.getElementById('word-count');
            if (wordsCount > maximumWordCount) {
                wordCounter?.classList.add('text-danger');
                dispatch(
                    handleSnackbarOpen(
                        {
                            severity: 'error',
                            message: `You can enter only ${maximumWordCount} words as abstract`
                        }
                    )
                );
            } else {
                if (wordCounter?.classList.contains('text-danger')) {
                    wordCounter?.classList.remove('text-danger');
                }
            }
        }
        onChange(value, fieldName);
    }

    return (
        <FormControl
            required={required}
            fullWidth
            error={error}
            sx={{ mb: 2 }}
        >
            <FormLabel>
                <Typography 
                    variant="title-sm"
                    textTransform="capitalize"
                >
                    {
                        label
                    }
                </Typography>
            </FormLabel>
            <TextField
                multiline
                variant="filled"
                aria-label="textarea"
                placeholder="Enter your text here"
                minRows={4}
                maxRows={10}
                value={value}
                onChange={(event: any) => {
                    countValidation(
                        event.target.value, 
                        wordCountLimit
                    );
                }}
                sx={{ pb: wordCountLimit ? 3 : 0 }}
            />
            {
                wordCountLimit &&
                <Box py={1} display="flex" className="word-count">
                    <Typography
                        pr={1}
                        component="span"
                        variant="body-sm"
                        position="relative"
                        id="word-count"
                    >
                        {wordCount || 0}
                    </Typography>
                    <Typography 
                        component="span" 
                        variant="body-sm" 
                        sx={{ opacity: .5 }}
                    >
                        {`/ ${wordCountLimit} words`}
                    </Typography>
                </Box>
            }
            {
                error &&
                <FormHelperText>
                    <Typography 
                        color="error" 
                        variant="body-sm"
                    >
                        This field is required
                    </Typography>
                </FormHelperText>
            }
        </FormControl>
    )
}

export default Textarea;