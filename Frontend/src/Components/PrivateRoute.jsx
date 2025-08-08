import { Navigate,Outlet } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = () => {
    const {userInfoJ}=useSelector(state=>state.auth)

  return (
     userInfoJ?<Outlet/>:<Navigate to='/login' replace/>
  )
}

export default PrivateRoute