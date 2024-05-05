import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store/store'
import Logo from '@/assets/images/brieflands-logo.png'
import { useLazyGetUserQuery } from '@/app/services/apiSlice'
import { Journal, User } from '@/app/services/types'
import { Box, Stack, Typography } from '@mui/material'

const Header = () => {
    const journal: Journal = useAppSelector((state: any) => state.wizard.journal);
    const [user, setUser] = useState<User>();
    const [getUserTrigger] = useLazyGetUserQuery();
    useEffect(() => {
        getUserTrigger('journal/profile').then(
            (response: any) => {
                setUser(response.data);
            }
        );
    }, []);

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
            id="logo"
        >
            <Box className="logo">
                <Stack direction="row" alignItems="center">
                    <Box pl={{ xs: 1, md: 3 }}>
                        <Image
                            src={Logo}
                            alt="Brieflands"
                            style={{ width: '45px', height: 'auto' }}
                        />
                    </Box>
                    <Typography variant="h1" pl={2} pr={1}>
                        Brieflands
                    </Typography>
                    {
                        (
                            journal !== undefined &&
                            Object.keys(journal).length > 0
                        ) &&
                        <Typography
                            variant="shadowLight"
                            fontWeight="bold"
                            fontSize={16}
                            pt={.25}
                            sx={{
                                display: {
                                    xs: 'none',
                                    md: 'block'
                                }
                            }} className="text-shadow-light"
                        >
                            {
                                journal.attributes?.title && (
                                    <>
                                        <Typography component="span" fontWeight={700} pr={1}>|</Typography>
                                        <Typography component="span" fontWeight={700}>
                                            {journal.attributes.title}
                                        </Typography>
                                    </>
                                )
                            }
                        </Typography>
                    }
                </Stack>
            </Box>
            {
                (
                    user !== undefined &&
                    Object.keys(user).length > 0
                ) &&
                <Stack
                    direction="row"
                    alignItems="center"
                    pr={{ xs: 1, md: 2 }}
                >
                    <Typography
                        p={1}
                        variant="shadowDark"
                        fontWeight="bold"
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'block',
                                md: 'block'
                            },
                            whiteSpace: 'nowrap'
                        }}
                        className="text-sm"
                    >
                        {user.attributes?.full_name}
                    </Typography>
                    <Image
                        className="rounded-full img-tiny box-shadow"
                        src={user?.attributes?.avatar}
                        alt={user?.attributes?.full_name}
                        title={user?.attributes?.full_name}
                        width={30}
                        height={30}
                        style={{ width: '30px', height: 'auto' }}
                    />
                </Stack>
            }
        </Stack>
    )
}

export default Header
