import Image from 'next/image'
import NotFountImage from '@/assets/images/404.png'
import { Box, Stack, Typography } from '@mui/material'

const NotFound = ( { message }: any ) => {
    return (
        <Box className="w-full flex items-center justify-center flex-1">
            <Box p={5} bgcolor="white" borderRadius={5}>
                <Image
                    width="300"
                    height="213"
                    alt="404 Not Found"
                    src={NotFountImage}
                />
                <Stack 
                    direction="row"
                    alignItems="center" 
                    justifyContent="center"
                    mt={2}
                >
                    <Typography variant="h3" color="primary">
                        Not Found!
                    </Typography>
                </Stack>
            </Box>
        </Box>
    )
}

export default NotFound;