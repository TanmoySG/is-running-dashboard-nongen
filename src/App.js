import React, { useState, useEffect } from "react";

function App() {
	const [username, setUsername] = useState('');
	const [password, setPasword] = useState('');
	const [userData, setUserData] = useState();
	const [view, setView] = useState();

	const login = (username, password) => {
		fetch("https://tanmoysg.com/is-running/" + username + "/login", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"content_type": "application/json",
			},
			body: JSON.stringify({ "password": password })
		}).then(response => {
			return response.json()
		}).then(res => {
			setUserData(res);
			setView();
		})
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

		</ThemeProvider>
	);
}

export default App;
