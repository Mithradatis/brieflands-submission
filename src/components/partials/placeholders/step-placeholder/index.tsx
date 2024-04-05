import { Skeleton } from '@mui/material'
 
const StepPlaceholder = () => {
    return (
        <div className="step-loader">
            <Skeleton variant="rectangular" height={200} className="w-100 rounded mb-3"></Skeleton>
            <Skeleton variant="rectangular" width="100" height={35} className="rounded mb-3"></Skeleton>
            <Skeleton variant="rectangular" width="100" height={35} className="rounded"></Skeleton>
        </div>
    )
}

export default StepPlaceholder;