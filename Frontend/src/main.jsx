import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route,RouterProvider,createRoutesFromElements } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './Pages/Auth/LoginPage.jsx'
import Register from './Pages/Auth/Register.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import HomePage from './Components/HomePage.jsx'
import Dashboard from './Pages/DashBoardContents/Dashboard.jsx'
import PrivateRoute from './Components/PrivateRoute.jsx'
import Profile from './Components/Profile.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import UsersPage from './Components/Admin/UserPage.jsx'
import JobsPage from './Components/Admin/JobsPage.jsx'
import AdminRoute from './Components/AdminRoute.jsx'
const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index element={<HomePage />} />
      <Route path='login' element={<LoginPage/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='' element={<PrivateRoute/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='profile' element={<Profile/>}/>
      </Route>
      <Route path='admin' element={<AdminRoute/>}>
        <Route path='dashboard' element={<AdminDashboard/>}/>
        <Route path='users' element={<UsersPage/>}/>
        <Route path='jobs' element={<JobsPage/>}/>
      </Route>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById("root")).render(
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
);
