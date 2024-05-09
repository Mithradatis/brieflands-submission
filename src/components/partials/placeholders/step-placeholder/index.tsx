import { Skeleton } from '@mui/material'
import { Box } from '@mui/material'
 
const StepPlaceholder = () => {
    return (
        <Box className="step-loader">
            <Skeleton 
                variant="rounded" 
                height={200}
                sx={{ mb: 2 }}
            ></Skeleton>
            <Skeleton 
                variant="rounded" 
                width="100" 
                height={35}
                sx={{ mb: 2 }}
            ></Skeleton>
            <Skeleton 
                variant="rounded" 
                width="100" 
                height={35}
                sx={{ mb: 2 }}
            ></Skeleton>
        </Box>
    )
}

export default StepPlaceholder;