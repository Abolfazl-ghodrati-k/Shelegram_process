import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
	const [user, setUser] = useState({
		loggedIn: null,
		token: localStorage.getItem("token"),
	});
	const [loading, setloading] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchData = async () => {
			setloading(true);
			await fetch(process.env.REACT_APP_SEVER_URL+"/auth/login", {
				method: "GET",
				headers: {
					authorization: `Bearer ${user.token}`,
				},
			})
				.catch((e) => {
					console.log(e);
					setloading(false);
					setUser({ loggedIn: false });
					localStorage.setItem("token", "");
				})
				.then((r) => {
					if (!r || !r.ok) {
						setUser({ loggedIn: false });
						setloading(false);
						localStorage.removeItem("token");
						return;
					}
					return r.json();
				})
				.then((response) => {
					if (!response) {
						setUser({ loggedIn: false });
						localStorage.removeItem("token");
						setloading(false);
						return;
					} else {
						console.log(`checking user:${response.token}`);
						setUser({ ...response });
						setloading(false);
						navigate("/home");
					}
				});
		};
		fetchData().catch(err => console.error(err));
	}, []);
	return (
		<AccountContext.Provider value={{ user, setUser, loading }}>
			{children}
		</AccountContext.Provider>
	);
};

export default UserContext;
