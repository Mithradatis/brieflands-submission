import Image from 'next/image'
import NotPermissionImage from '@/assets/images/not-permission.png'
import { Box, Stack, Typography } from '@mui/material'

const NotPermission = ( { message }: any ) => {
    return (
        <Box p={4} bgcolor="white" borderRadius={5} m={'auto'}>
            <Image 
                width="306" 
                height="204"
                alt="Permission Denied"
                src={NotPermissionImage}
            />
            <Stack direction="row" alignItems="center" justifyContent="center" mt={3}>
                <Typography variant="h3" color="primary">
                    { message }
                </Typography>
            </Stack>
        </Box>
    )
}

export default NotPermission;