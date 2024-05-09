'use client'

import React from 'react'
import Header from '@/components/partials/header'
import Footer from '@/components/partials/footer'
import { Box, ThemeProvider, CssBaseline, Stack } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { GlobalStyle } from '@/styles/global/globalStyles'
import { theme } from '@/styles/theme/theme'
import { ErrorBoundary } from '@/app/services/errors/error-boundry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <React.StrictMode>
      <html>
        <head>
          <title>Submission</title>
          <link
            rel="shortcut icon"
            type="image/png"
            href="/favicon.png"
          />
        </head>
        <body>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyle />
              <Stack
                className="bg-main border-t-2 border-t-dark-blue bg-texture"
                direction="column"
                justifyContent="center"
                alignItems="center"
                px={0}
                pb={{ xs: 4 }}
                sx={{ height: '100%', minHeight: '100svh' }}
              >
                <Header />
                <Box
                  pt={{ xs: 2, md: 4 }}
                  px={{ xs: 0, md: 4 }}
                  pb={{ xs: 3, md: 5 }}
                  display="flex"
                  sx={{ 
                    maxWidth: { xs: '100%' },
                    flexGrow: 1 
                  }}
                >
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </Box>
                <Footer />
              </Stack>
            </ThemeProvider>
          </Provider>
        </body>
      </html>
    </React.StrictMode>
  )
}
