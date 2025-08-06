import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route,RouterProvider,createRoutesFromElements } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './Pages/Auth/LoginPage.jsx'
import Register from './Pages/Auth/Register.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='login' element={<LoginPage/>}/>
      <Route path='register' element={<Register/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById("root")).render(
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
);
