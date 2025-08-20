import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const { userInfoJ } = useSelector((state) => state.auth);

  if (!userInfoJ) {
    return <Navigate to="/login" replace />;
  }
 
  if (!userInfoJ.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
