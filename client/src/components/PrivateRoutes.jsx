import { Outlet, Navigate } from 'react-router-dom';
import { AccountContext } from '../Context/AccountContext';
import { useContext } from 'react';

const useAuth = () => {
	const {user} = useContext(AccountContext)
	return user && user.loggedIn;
	// return true
};

const PrivateRoutes = () => {
	const isAuth = useAuth();
	return isAuth ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoutes;
