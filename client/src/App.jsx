import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import LoginPage from './pages/user/Login'
import AdminRoutes from './routes/admin.routes'
import UserRoutes from './routes/user.routes'
import { Toaster } from 'sonner'
function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes/>}/>
      <Route path="/*" element={<UserRoutes/>}/>
    </Routes>
    </>
  )
}

export default App