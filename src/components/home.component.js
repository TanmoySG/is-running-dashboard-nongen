import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Divider } from "@mui/material";
import Spinner from "react-cli-spinners/dist";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faHistory, faLink } from '@fortawesome/free-solid-svg-icons';

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
            setLoadStatus("Ready");
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

                <Paper variant="outlined" style={{ padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <FontAwesomeIcon icon={faHistory} style={{ marginRight: "7.5px" }} />
                        <span style={{ fontWeight: "600" }}>isRunning</span> Dashboard
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
                    <div style={{ margin: "20px 0" }}>
                        <Paper variant="outlined" style={{ padding: "5px" }} >
                            <Typography style={{ fontFamily: "Work Sans" }}>
                                {loadStatus === "Ready" ? <span>⣿</span> : <Spinner type="dots2" style={{ color: "rgb(187, 183, 223)" }} />}
                                {loadStatus ? loadStatus : "Spinning Up Process"}
                            </Typography>
                        </Paper>
                    </div>
                </Paper>
                <Paper variant="outlined" style={{ marginTop: "10px", padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem" }}>
                        <FontAwesomeIcon icon={faLink} style={{ marginRight: "7.5px" }} />
                        <span style={{ fontWeight: "600" }}>EP Library</span>
                        {/*}
                        <span style={{ margin: "0 0 0 10px", fontWeight: "600", padding: "5px 7px", border: "3px solid rgb(187, 183, 223)", borderRadius: "50px" }}>{iRData ? Object.keys(iRData).length : 0}</span>
                        {*/}
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
                                                <FontAwesomeIcon icon={faCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
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
                                                <FontAwesomeIcon icon={faCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                {ep}
                                            </Typography>
                                        </div>
                                    )
                                }) : undefined
                            }
                        </div>
                    </div>

                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Paper variant="outlined" style={{ padding: "20px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                    sd
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