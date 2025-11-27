import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import RoutesComponent from './components/RoutesComponent'
import { AuthProvider } from './context/AuthProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
        <BrowserRouter basename='/Dishly'>
          <RoutesComponent/>
        </BrowserRouter>
        </AuthProvider>

  )
}

export default App
