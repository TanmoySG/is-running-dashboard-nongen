import React, { useState, useEffect } from "react";
import Home from "./components/home.component";
import Container from "@mui/material/Container"
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Divider, Grid, Paper, Typography, TextField, Button } from "@mui/material";
import useReactFontLoader from 'react-font-loader';
import './App.css';

function App() {

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
			background: {
				default: "#1C1C1E" /*#000408*/
			}
		},
	});

	useReactFontLoader({
		url:
			"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap",
	});


	const [username, setUsername] = useState('');
	const [password, setPasword] = useState('');
	/*	const [userData, setUserData] = useState();*/
	const [view, setView] = useState();

	function login(username, password) {
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
			window.sessionStorage.setItem("status", "logged_in");
			window.sessionStorage.setItem("email", res.email);
			window.sessionStorage.setItem("name", res.name);
			window.sessionStorage.setItem("token", res.token);
			window.sessionStorage.setItem("password", password)
			setView("logged_in");
		})
	}


	useEffect(() => {
		if (window.sessionStorage.getItem("status") === 'logged_in') {
			setView("logged_in");
		}
	}, [])



	/*console.log(window.sessionStorage.getItem("token"));*/

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Container maxWidth="xl" style={{ padding: "25px", height: "100%" }}>
				{
					view ? <Home /> :
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
							spacing={2}
							style={{ height: "100%" }}
						>
							<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
								<Paper variant="outlined" style={{ padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
									<Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}><span style={{ fontWeight: "600" }}>isRunning</span> Login</Typography>
									<Divider style={{ margin: "10px 0" }} />
									<div style={{ margin: "15px 0 0 0" }}>
										<Typography style={{ fontFamily: "Work Sans" }}>Email</Typography>
										<TextField fullWidth onChange={e => { setUsername(e.target.value) }}
											style={{ fontFamily: "Work Sans", margin: "0 0 10px 0" }}
										/>
									</div>
									<div style={{ margin: "15px 0 0 0" }} >
										<Typography style={{ fontFamily: "Work Sans" }}>Password</Typography>
										<TextField fullWidth onChange={e => { setPasword(e.target.value) }}
											style={{ fontFamily: "Work Sans", margin: "0 0 10px 0" }}
										/>
									</div>
									<div style={{ margin: "15px 0 0 0" }} >
										<Button onClick={() => { login(username, password) }} variant="outlined" size="large"
											style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
										>
											Sign-in
										</Button>
									</div>
								</Paper>
							</Grid>
						</Grid>
				}
			</Container>
		</ThemeProvider>
	);
}

export default App;
