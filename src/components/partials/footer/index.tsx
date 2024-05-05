import { Box, Link, Stack, Typography } from '@mui/material'

const Footer = () => {
    return (
        <Box component="footer" className="absolute w-full bottom-0">
            <Stack
                direction={
                    {
                        xs: 'column',
                        md: 'row'
                    }
                }
                alignItems={
                    {
                        xs: 'flex-start',
                        md: 'center'
                    }
                }
                justifyContent={
                    {
                        xs: 'center',
                        md: 'space-between'
                    }
                }
                sx={{ fontSize: '.8rem', fontWeight: '700' }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    fontSize={14}
                    fontWeight={700}
                    px={3}
                    py={1}
                >
                    <Box>
                        <Typography variant="shadowDark" pr={.5}>
                            Copyright © {new Date().getFullYear()},
                        </Typography>
                        <Link
                            href="https://brieflands.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="light"
                        >
                            <Typography variant="shadowDark">Brieflands.</Typography>
                        </Link>
                    </Box>
                    <Box>
                        <Typography 
                            display={{ xs: 'none', md: 'inline-block' }}
                            variant="shadowDark" 
                            px={1} 
                            sx={{ opacity: .25 }}
                        >
                            |
                        </Typography>
                        <Typography variant="shadowDark">All Rights Reserved.</Typography>
                    </Box>
                    <Box display={{ xs: 'none', md: 'inline-block' }}>
                        <Typography
                            variant="shadowDark"
                            px={1}
                            sx={{ opacity: .25 }}
                        >
                            |
                        </Typography>
                        <Link
                            href="http://creativecommons.org/licenses/by-nc/4.0/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="light"
                            variant="shadowDark"
                        >
                            <Typography variant="shadowDark">
                                CC BY-NC 4.0
                            </Typography>
                        </Link>
                    </Box>
                </Stack>
                <Typography
                    component="div"
                    flexDirection="row"
                    fontSize={14}
                    fontWeight={700}
                    variant="shadowDark"
                    px={3}
                    py={1}
                    display={
                        {
                            xs: 'none',
                            md: 'flex'
                        }
                    }
                >
                    Powered by
                    <Link
                        href="https://www.neoscriber.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="light">
                        NeoScriber ®
                    </Link>
                    <Typography px={1} sx={{ opacity: .25 }}>|</Typography>
                    <Link
                        href="https://brieflands.com/brieflands/forms/support.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="light"
                    >
                        Feedback
                    </Link>
                </Typography>
            </Stack>
        </Box>
    )
}

export default Footer