import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from './Pages/Dashboard'
import SignUp from './Pages/SignUp'
import Navbar from './components/Navbar'
function App() {
  const [count, setCount] = useState(0)

  return (
 <>
   <Navbar/>
   <Routes>
    
    <Route path='/' element={<HomePage/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<SignUp/>}/>
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
         <Dashboard/>
        </ProtectedRoute>
      }
    />
   </Routes>
 </>
  )
}

export default App
