import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
	const [user, setUser] = useState({
		loggedIn: null,
		token: localStorage.getItem("token") ? localStorage.getItem("token"): null,
	});
	const navigate = useNavigate();
	useEffect(() => {
		fetch("http://localhost:5050/auth/login", {
			method: "GET",
			headers: {
				authorization: `Bearer ${user.token}`,
			},
		})
			.catch((e) => {
				console.log(e);
				setUser({ loggedIn: false });
				localStorage.setItem("token", "");
			})
			.then((r) => {
				if (!r || !r.ok) {
					setUser({ loggedIn: false });
					localStorage.removeItem("token");
					return;
				}
				return r.json();
			})
			.then((response) => {
				if (!response) {
					setUser({ loggedIn: false });
					localStorage.removeItem("token");
					return;
				}
				console.log(`checking user:${response.token}`);
				setUser({ ...response });
				navigate("/home");
			});
	}, []);
	return (
		<AccountContext.Provider value={{ user, setUser }}>
			{children}
		</AccountContext.Provider>
	);
};

export default UserContext;
