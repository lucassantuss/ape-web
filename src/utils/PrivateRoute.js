import { Outlet, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/Authentication";
import { useEffect } from "react";

const PrivateRoute = ({ allowedTypes }) => {
  const { userLogged, userType } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLogged()) {
      navigate("/login"); // se não estiver logado, manda pro login
    } else if (!allowedTypes.includes(userType)) {
      navigate("/"); // se não tiver permissão, manda pra home
    }
  }, [userLogged, userType, allowedTypes, navigate]);

  if (!userLogged()) return null;

  return allowedTypes.includes(userType) ? <Outlet /> : null;
};

export default PrivateRoute;
