'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import styles from '@/page.module.css'
import Container from '@/components/partials/general'
import Header from '@/components/partials/header'
import Footer from '@/components/partials/footer'
import '@/assets/fontawesome-6/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/global.scss'
import '@/assets/css/formWizard.scss'

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
          <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
        </head>
        <body>
          <Provider store={store}>
            <Container />
            <div className="main-container bg-texture d-flex flex-column">
              <Header />
              <main className={`${styles.main} pt-4 px-4 pb-5 pb-md-4 flex-grow-1`}>
                { children }
              </main>
              <Footer />
            </div>
          </Provider>
        </body>
      </html>
    </React.StrictMode>
  )
}
