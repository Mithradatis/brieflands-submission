'use client'

import Image from 'next/image'
import LogoImage from '@/assets/images/brieflands-logo.png'
import { Box, Stack, styled, useTheme } from '@mui/material'

export default function PageLoading() {
    const theme: any = useTheme();
    const LoadingContainer = styled(Stack)({
        zIndex: 1050,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: `${theme.palette.primary[500]}`
    });
    const Logo = styled(Stack)({
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        backgroundColor: '#1a2b20',
    });
    const Loading = styled(Box)({
        position: 'fixed',
        borderRadius: '50%',
        width: '4.25rem',
        height: '4.25rem',
        border: '.25rem solid rgba(255, 255, 255, .2)',
        borderTopColor: 'white',
        animation: 'spin 1s infinite linear'
    });

    return (
        <LoadingContainer
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Logo
                direction="row"
                alignItems="center"
                justifyContent="center"
                className="logo"
                p={3}
            >
                <Image
                    src={LogoImage}
                    alt="Brieflands"
                    width={25}
                    height={22.5}
                />
            </Logo>
            <Loading className="loading" />
        </LoadingContainer>
    )
}