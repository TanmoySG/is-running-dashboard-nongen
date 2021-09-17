import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Divider, Button, TextField, ToggleButtonGroup, ToggleButton } from "@mui/material";
import Spinner from "react-cli-spinners/dist";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faExclamationCircle, faFolderPlus, faHistory, faLayerGroup, faLink, faMouse, faPlus, faPlusCircle, faRocket, faSignOutAlt, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

export default function Home() {

    const [iRData, setIRData] = useState({});
    const [name, setName] = useState(window.sessionStorage.getItem("name"))
    const [username, setUsername] = useState(window.sessionStorage.getItem("email"))
    const [password, setPassword] = useState(window.sessionStorage.getItem("password"))
    const [token, setToken] = useState(window.sessionStorage.getItem("token"))
    const [metrics, setMetrics] = useState();

    const [loadStatus, setLoadStatus] = useState('Ready');


    function getIRStatusData(username, password) {
        setLoadStatus("Loading");
        const endpoint = "https://tanmoysg.com/is-running/" + username + "/get/status"
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({ "password": password })
        }).then(response => {
            return response.json()
        }).then(res => {
            var upCount = 0;
            var downCount = 0;
            var listOfUpEPs = [];
            var listOfDownEPs = [];
            setIRData(res);
            Object.keys(res).map((ep, i) => {
                if (res[ep]['running'] === "Running") {
                    upCount++;
                    listOfUpEPs.push(ep);
                } else {
                    downCount++;
                    listOfDownEPs.push(ep);
                }
            });
            setMetrics({
                "downCount": downCount,
                "upCount": upCount,
                "listOfUpEPs": listOfUpEPs,
                "listOfDownEPs": listOfDownEPs,
            })
            setTimeout(function () {
                setLoadStatus("Ready");
            }, 1500)
        })
    }

    useEffect(() => {
        setUsername(window.sessionStorage.getItem("email"));
        setPassword(window.sessionStorage.getItem("password"));
        setToken(window.sessionStorage.getItem("token"));
        getIRStatusData(username, password)
    }, [])


    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
        >

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Paper variant="outlined" style={{ marginBottom: "10px", padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faHistory} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>isRunning</span>
                            </Grid>
                            <Grid item>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                            </Grid>
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "15px" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Button onClick={() => { }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Run Bulk Check
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Button onClick={() => { }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Generate Summary
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button onClick={() => { }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Generate Report for All Endpoints
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
                <Paper variant="outlined" style={{ padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faUserAstronaut} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>Dashboard</span>
                            </Grid>
                            <Grid item>
                                {/*}
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                                {*/}
                            </Grid>
                        </Grid>


                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    {/*}
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>
                        Hi <span style={{ fontWeight: "600" }}>{name}</span>
                    </Typography>
                    {*/}
                    <div style={{ margin: "25px 0 15px 0" }}>
                        <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>
                            <Grid container>
                                <Grid item xs={7} sm={7} md={5} lg={5} xl={5}>
                                    Active EPs in EPLib
                                </Grid>
                                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                                    <span style={{ margin: "0 0 0 5px", fontWeight: "600", padding: "5px 7px", border: "2px solid rgb(187, 183, 223)", borderRadius: "50px" }}><FontAwesomeIcon icon={faLink} style={{ margin: "0 5px 0 0" }} />{iRData ? Object.keys(iRData).length : 0} <b>/</b> {iRData ? Object.keys(iRData).length : 0}</span>
                                </Grid>
                            </Grid>
                        </Typography>

                    </div>
                    <div style={{ margin: "15px 0" }}>
                        <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>
                            <Grid container>
                                <Grid item xs={7} sm={7} md={5} lg={5} xl={5}>
                                    Running Endpoints
                                </Grid>
                                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                                    <span style={{ margin: "0 0 0 5px", fontWeight: "600", padding: "5px 7px", border: "2px solid rgb(187, 183, 223)", borderRadius: "50px" }}><FontAwesomeIcon icon={faCircle} style={{ margin: "0 2px 0 0", color: "#3faf62" }} /> {metrics ? metrics['upCount'] : 0} <b>/</b> {iRData ? Object.keys(iRData).length : 0}</span>                                        </Grid>
                            </Grid>
                        </Typography>
                    </div>
                    <div style={{ margin: "15px 0" }}>
                        <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>
                            <Grid container>
                                <Grid item xs={7} sm={7} md={5} lg={5} xl={5}>
                                    Down Endpoints
                                </Grid>
                                <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                                    <span style={{ margin: "0 0 0 5px", fontWeight: "600", padding: "5px 7px", border: "2px solid rgb(187, 183, 223)", borderRadius: "50px" }}><FontAwesomeIcon icon={faCircle} style={{ margin: "0 2px 0 0", color: "#AA0023" }} /> {metrics ? metrics['downCount'] : 0} <b>/</b> {iRData ? Object.keys(iRData).length : 0}</span>
                                </Grid>
                            </Grid>
                        </Typography>
                    </div>
                    <div style={{ margin: "20px 0 0 0" }}>
                        <Paper variant="outlined" style={{ padding: "5px" }} >
                            <Typography style={{ fontFamily: "Work Sans" }}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    spacing={0.5}
                                >
                                    <Grid item>
                                        {loadStatus === "Ready" ? <span>✔️</span> : <Spinner type="dots2" style={{ color: "#e7a000" }} />}
                                    </Grid>
                                    <Grid item>
                                        {loadStatus ? loadStatus : "Spinning Up Process"}
                                    </Grid>
                                </Grid>
                            </Typography>
                        </Paper>
                    </div>
                </Paper>
                <Paper variant="outlined" style={{ marginTop: "10px", padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faLink} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>EP Library</span>
                            </Grid>
                            <Grid item>
                                <FontAwesomeIcon icon={faPlus} style={{ color: "#3faf62" }} />
                            </Grid>
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "20px" }}>
                        <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>
                            Down Endpoints
                            <span style={{ margin: "0 0 0 10px", fontWeight: "600", padding: "4px 7px", border: "3px solid #AA0023", borderRadius: "75px" }}>
                                <FontAwesomeIcon icon={faCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                {metrics ? metrics['downCount'] : 0}
                            </span>
                        </Typography>
                        <div style={{ margin: "15px 0" }}>
                            {
                                metrics ? metrics['listOfDownEPs'].map((ep) => {
                                    return (
                                        <div style={{ margin: "2px 0" }}>
                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                {ep}
                                            </Typography>
                                        </div>
                                    )
                                }) : undefined
                            }
                        </div>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>
                            Running Endpoints
                            <span style={{ margin: "0 0 0 10px", fontWeight: "600", padding: "4px 7px", border: "3px solid #3faf62", borderRadius: "75px" }}>
                                <FontAwesomeIcon icon={faCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                {metrics ? metrics['upCount'] : 0}
                            </span>
                        </Typography>
                        <div style={{ margin: "15px 0" }}>
                            {
                                metrics ? metrics['listOfUpEPs'].map((ep) => {
                                    return (
                                        <div style={{ margin: "2px 0" }}>
                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                {ep}
                                            </Typography>
                                        </div>
                                    )
                                }) : undefined
                            }
                        </div>
                    </div>
                </Paper>
                {/* Add EP to EPLib }
                <Paper variant="outlined" style={{ marginTop: "10px", padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faFolderPlus} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>Add to EP Library</span>
                            </Grid>
                            <Grid item>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                            </Grid>
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "15px" }}>

                        <div >
                            <div>
                                <Typography style={{ fontFamily: "Work Sans" }}>Password</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div>
                                <Typography style={{ fontFamily: "Work Sans" }}>Password</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div>
                                <Typography style={{ fontFamily: "Work Sans" }}>Password</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div>
                                <Typography style={{ fontFamily: "Work Sans" }}>Password</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div>
                                <Typography style={{ fontFamily: "Work Sans" }}>Password</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div style={{ margin: "10px 0 10px 0" }} >
                                <Button onClick={() => { }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Add Endpoint
                                </Button>
                            </div>
                        </div>
                    </div>
                </Paper>
                {*/}
                <Paper variant="outlined" style={{ marginTop: "10px", padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faRocket} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>On-Demand Check</span>
                            </Grid>
                            <Grid item>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                            </Grid>
                        </Grid>


                        {/*}
                        <span style={{ margin: "0 0 0 10px", fontWeight: "600", padding: "5px 7px", border: "3px solid rgb(187, 183, 223)", borderRadius: "50px" }}>{iRData ? Object.keys(iRData).length : 0}</span>
                        {*/}
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "15px" }}>

                        <div >
                            <Typography style={{ fontFamily: "Work Sans" }}>Endpoint</Typography>
                            <TextField fullWidth onChange={e => { }}
                                style={{ fontFamily: "Work Sans" }}
                            />
                            <div style={{ margin: "10px 0 10px 0" }} >
                                <Button onClick={() => { }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Check Endpoint
                                </Button>
                            </div>
                        </div>
                    </div>

                </Paper>

            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Paper variant="outlined" style={{ padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faFolderPlus} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>Add to EP Library</span>
                            </Grid>
                            <Grid item>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                            </Grid>
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "15px" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                                <div style={{ marginTop: "10px" }}>
                                    <Typography style={{ fontFamily: "Work Sans" }}>Endpoint</Typography>
                                    <TextField fullWidth onChange={e => { }}
                                        style={{ fontFamily: "Work Sans" }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <div style={{ marginTop: "10px" }}>
                                    <Typography style={{ fontFamily: "Work Sans" }}>Routine</Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        exclusive
                                    >
                                        <ToggleButton value="6">6 Hrs</ToggleButton>
                                        <ToggleButton value="12">12 Hrs</ToggleButton>
                                        <ToggleButton value="24">24 Hrs</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </Grid>

                        </Grid>
                        <div >
                            <div style={{ marginTop: "10px" }}>
                                <Typography style={{ fontFamily: "Work Sans" }}>Routine</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <Typography style={{ fontFamily: "Work Sans" }}>Recipient</Typography>
                                <TextField fullWidth onChange={e => { }}
                                    style={{ fontFamily: "Work Sans" }}
                                />
                            </div>
                            <div style={{ margin: "15px 0 10px 0" }} >
                                <Button onClick={() => { }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Add Endpoint
                                </Button>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
            {/*}
            <Grid item xs={4} >
                <Spinner type="dots2" style={{color: "rgb(187, 183, 223)"}} />
            </Grid>
             
                <Grid item xs={4} >
                    <Spinner type="moon" />
                </Grid>
            {*/}
        </Grid>
    );
}

{/* ⣿ */ }