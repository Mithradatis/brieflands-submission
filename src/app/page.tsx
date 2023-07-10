'use client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './resources/css/customStyle.scss'
import './resources/fontawesome-6/css/all.min.css'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './middle'

export default function Home() {
  return (
    <Provider store={ store }>
        <App />
    </Provider>
  )
}
