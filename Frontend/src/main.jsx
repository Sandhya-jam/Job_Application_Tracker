import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route,RouterProvider,createRoutesFromElements } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './Pages/Auth/LoginPage.jsx'
import Register from './Pages/Auth/Register.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='login' element={<LoginPage/>}/>
      <Route path='register' element={<Register/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById("root")).render(
      <RouterProvider router={router}/>
);
