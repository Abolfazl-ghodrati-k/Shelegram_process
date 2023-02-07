import { Outlet, Navigate } from "react-router-dom";
import { AccountContext } from "../Context/AccountContext";
import { useContext } from "react";

const useAuth = () => {
	const { user, loading } = useContext(AccountContext);
	return [user && user.loggedIn, loading];
};

const PrivateRoutes = () => {
	const [isAuth, loading] = useAuth();
	if (loading) {
		return (
			<div
				style={{
					width: "100vw",
					display: "grid",
					placeItems: "center",
					fontSize: "1.5rem",
					height: "100vh",
				}}
			>
				loading...
			</div>
		);
	} else if (isAuth) {
		return <Outlet />;
	} else {
		return<Navigate to={"/"} />;
	}
};

export default PrivateRoutes;
