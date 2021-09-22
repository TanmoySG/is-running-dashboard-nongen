import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Divider, Button, TextField, Accordion, AccordionDetails, AccordionSummary, Chip, Select, MenuItem, Tooltip, IconButton, Avatar, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import Spinner from "react-cli-spinners/dist";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faChartLine, faCheckCircle, faCircle, faCog, faExclamationCircle, faFolderPlus, faHistory, faLayerGroup, faLink, faPlus, faRocket, faSignOutAlt, faTimes, faTrash, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import ResponseTimeChart from "./chart.component";


export default function Home() {

    // UI Runner Components
    const loadingSpinners = ["dots2", "moon"]
    const [openDeleteBox, setOpenDeleteBox] = useState(false);

    // User Data Hooks
    const [iRData, setIRData] = useState({});
    const [name, setName] = useState(window.sessionStorage.getItem("name"))
    const [username, setUsername] = useState(window.sessionStorage.getItem("email"))
    const [password, setPassword] = useState(window.sessionStorage.getItem("password"))
    const [token, setToken] = useState(window.sessionStorage.getItem("token"))
    const [metrics, setMetrics] = useState();

    // Add new EP Hooks
    const [endpointURL, setEndpointURL] = useState();
    const [endpointName, setEndpointName] = useState();
    const [endpointDescription, setEndpointDescription] = useState();
    const [endpointRoutine, setEndpointRoutine] = useState();
    const [mailingList, setMailingList] = useState([]);

    // Util Hooks
    const [loadStatus, setLoadStatus] = useState('Ready');
    const [topToolBar, setTopToolBar] = useState("none");

    // Random Check EP Hook
    const [randomCheckEP, setRandomCheckEP] = useState();

    // Data Expansion Panel Hooks
    const [expanded, setExpanded] = React.useState(false);

    // Util UI Functions
    const handleExandPanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpenDeleteBox = (id) => {
        setOpenDeleteBox(id);
    }

    const handleCloseDeleteBox = () => {
        setOpenDeleteBox();
    }

    const handleLogout = () => {
        window.sessionStorage.removeItem("status");
        window.sessionStorage.removeItem("email");
        window.sessionStorage.removeItem("name");
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("password");
        window.location.reload()
    }


    function handleRandomCheck() {
        const searchEp = "https://tanmoysg.com/is-running/check-uptime?endpoint=" + randomCheckEP;
        fetch(searchEp, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            }
        }).then(response => {
            return response.json()
        }).then(result => {
            if (result.response === "Success") {
                toast.success("The Endpoint is Up.");
            } else {
                toast.error("The Endpoint is Down.");
            }
        })
    }

    const clearAddEPForm = () => {
        setEndpointName();
        setEndpointURL();
        setEndpointDescription();
        setEndpointRoutine();
        setMailingList([]);
        setTopToolBar("none");
    }

    const handleAddMail = (event, mail) => {
        if (event.key === 'Enter') {
            setMailingList([mail, ...mailingList]);
        }
    }

    const handleDeleteFromMailList = (mail) => {
        setMailingList(mailingList.filter(item => item !== mail));
    }


    function getIRStatusData() {
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

    function handleAddEndpoint() {
        setLoadStatus("Loading");
        if (endpointURL !== undefined && endpointName !== undefined && endpointDescription !== undefined && mailingList.length > 0 && endpointRoutine !== undefined) {
            const endpoint = "https://tanmoysg.com/is-running/" + username + "/add/endpoint"
            fetch(endpoint, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "content_type": "application/json",
                },
                body: JSON.stringify({
                    "password": password,
                    "endpoint": endpointURL,
                    "name": endpointName,
                    "description": endpointDescription,
                    "recipients": mailingList,
                    "routine": endpointRoutine
                })
            }).then(response => {
                return response.json();
            }).then(res => {
                if (res.response === "new_ep_added") {
                    toast.success("Endpoint Added!");
                    getIRStatusData();
                    clearAddEPForm();
                } else {
                    toast.error("Endpoint Already Exists!")
                }
            });
            setLoadStatus("Ready");
        } else {
            toast.error("Missing Parameters")
        }
    }


    function handleGenerateOnRequestReport(ep) {
        setLoadStatus("Loading");
        const endpoint = "https://tanmoysg.com/is-running/" + username + "/generate/report/on-request"
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "password": password,
                "endpoint": ep
            })
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res['response'] === "report_sent") {
                toast.success("Report Generated & Mailed")
            } else {
                toast.error("There was an error.")
            }
        });
        setLoadStatus("Ready");
    }


    function handleBulkCheck() {
        setLoadStatus("Loading");
        const endpoint = "https://tanmoysg.com/is-running/" + username + "/check-all/"
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "password": password
            })
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res['response'] === "bulk_check_success") {
                toast.success("Bulk Check Complete!")
            } else {
                toast.error("There was an error.")
            }
            setMetrics();
            setTimeout(function () {
                getIRStatusData();
            }, 200)
        });
        setLoadStatus("Ready");
    }


    function handleGenerateReport(mode) {
        setLoadStatus("Loading");
        const endpoint = "https://tanmoysg.com/is-running/" + username + "/generate/report/" + mode;
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "password": password
            })
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res['response'] === "report_sent") {
                toast.success("Report Generated & Mailed")
            } else {
                toast.error("There was an error.")
            }
        });
        setLoadStatus("Ready");
    }


    function handleCheckUptime(ep) {
        setLoadStatus("Loading");
        const endpoint = "https://tanmoysg.com/is-running/" + username + "/check/endpoint"
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "password": password,
                "endpoint": ep
            })
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res['running'] === "Downtime") {
                toast.error(<span>{res["status"]} - Down</span>)
            } else {
                toast.success(<span>{res["status"]} - Running</span>)
            }
            setMetrics();
            setTimeout(function () {
                getIRStatusData();
            }, 200)
        });
        setLoadStatus("Ready");
    }


    function handleDeleteEP(ep) {
        setLoadStatus("Loading");
        if (openDeleteBox !== undefined) {
            const endpoint = "https://tanmoysg.com/is-running/" + username + "/delete/endpoint"
            fetch(endpoint, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "content_type": "application/json",
                },
                body: JSON.stringify({
                    "password": password,
                    "endpoint": ep
                })
            }).then(response => {
                return response.json();
            }).then(res => {
                if (res.response === "ep_deleted") {
                    toast.success("Endpoint Deleted!");
                    setMetrics();
                    setTimeout(function () {
                        getIRStatusData();
                    }, 500)
                    handleCloseDeleteBox();
                } else {
                    toast.error("Endpoint Doesn't Exist in EPLib.")
                }
            });
            setLoadStatus("Ready");
        } else {
            toast.error("Missing Parameters")
        }
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
            <Toaster />
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
                                <IconButton aria-label="logout" onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                                </IconButton>
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
                                <Button onClick={handleBulkCheck} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Run Bulk Check
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Button onClick={() => { handleGenerateReport("cumulative") }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Generate Summary
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button onClick={() => { handleGenerateReport("each-owner") }} variant="outlined" size="large"
                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                >
                                    Mail report to Each Owner
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
                                    Active Endpoints
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
                                        {loadStatus === "Ready" ? <span>✔️</span> : <Spinner type={loadingSpinners[Math.floor(Math.random() * loadingSpinners.length)]} style={{ color: "#e7a000" }} />}
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
                                <span style={{ fontWeight: "600" }}>EP Library<sup>µ</sup></span>
                            </Grid>
                            <Grid item>
                                <IconButton aria-label="delete" onClick={() => { setTopToolBar('add_ep_panel') }}>
                                    <FontAwesomeIcon icon={faPlus} style={{ color: "#3faf62" }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "20px", wordWrap: "break-word" }}>
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
                                        <Tooltip title={ep} arrow={true} >
                                            <div style={{ margin: "2px 0", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                                <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                    <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                    {ep}
                                                </Typography>
                                            </div>
                                        </Tooltip>
                                    )
                                }) : <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>Wohoo! No Downtime!</Typography>
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
                                        <Tooltip title={ep} arrow={true} style={{ fontFamily: "Work Sans" }} >
                                            <div style={{ margin: "2px 0", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                                <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                    {ep}
                                                </Typography>
                                            </div>
                                        </Tooltip>
                                    )
                                }) : undefined
                            }
                        </div>
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
                                <FontAwesomeIcon icon={faRocket} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>On-Demand Check</span>
                            </Grid>
                            <Grid item>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                            </Grid>
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ marginTop: "15px" }}>

                        <div >
                            <Typography style={{ fontFamily: "Work Sans" }}>Endpoint</Typography>
                            <TextField fullWidth onChange={e => { setRandomCheckEP(e.target.value) }}
                                style={{ fontFamily: "Work Sans" }}
                            />
                            <div style={{ margin: "10px 0 10px 0" }} >
                                <Button onClick={handleRandomCheck} variant="outlined" size="large"
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
                {
                    topToolBar === "none" ? undefined :
                        <Paper variant="outlined" style={{ padding: "25px", borderRadius: "10px", boxShadow: "rgb(8 7 17 / 50%) 0px 0px 12px 0px", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
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
                                        <IconButton aria-label="delete" onClick={() => { setTopToolBar('none') }}>
                                            <FontAwesomeIcon icon={faTimes} style={{ color: "#AA0023" }} />
                                        </IconButton>
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
                                            <Typography style={{ fontFamily: "Work Sans", marginBottom: "7.5px" }}>Endpoint</Typography>
                                            <TextField fullWidth onChange={e => { setEndpointURL(e.target.value) }}
                                                style={{ fontFamily: "Work Sans" }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                        <div style={{ marginTop: "10px" }}>
                                            <Typography style={{ fontFamily: "Work Sans", marginBottom: "7.5px" }}>Run Routine Check every </Typography>
                                            <Select
                                                fullWidth
                                            >
                                                <MenuItem value={6} onClick={(e) => { setEndpointRoutine(6) }} >6 Hours - Recommended for Vital Services</MenuItem>
                                                <MenuItem value={12} onClick={(e) => { setEndpointRoutine(12) }} >12 Hours - Recommended for Moderately Important Services </MenuItem>
                                                <MenuItem value={24} onClick={(e) => { setEndpointRoutine(24) }} >24 Hours - Recommended for other non-vital Services</MenuItem>
                                            </Select>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                        <div style={{ marginTop: "10px" }}>
                                            <Typography style={{ fontFamily: "Work Sans", marginBottom: "7.5px" }}>Name</Typography>
                                            <TextField fullWidth onChange={e => { setEndpointName(e.target.value) }}
                                                style={{ fontFamily: "Work Sans" }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                        <div style={{ marginTop: "10px" }}>
                                            <Typography style={{ fontFamily: "Work Sans", marginBottom: "7.5px" }}>Description</Typography>
                                            <TextField fullWidth onChange={e => { setEndpointDescription(e.target.value) }}
                                                style={{ fontFamily: "Work Sans" }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <div style={{ marginTop: "10px" }}>
                                            <Typography style={{ fontFamily: "Work Sans", marginBottom: "7.5px" }}>Alerts Mailing List</Typography>
                                            <div style={{ border: "1px solid #616161", padding: "15px 10px", borderRadius: "5px", margin: "0 0 10px 0" }} >
                                                {
                                                    mailingList.length > 0 ? mailingList.map((mail) => {
                                                        return (
                                                            <Chip label={mail} variant="outlined" onDelete={() => { handleDeleteFromMailList(mail) }} style={{ border: "3px solid #BBB7DF", color: "#BBB7DF", fontFamily: "Work Sans", marginRight: "5px" }} />
                                                        )
                                                    }) : <span style={{ color: "#BBB7DF", fontFamily: "Work Sans" }}>Add Mails</span>
                                                }
                                            </div>
                                            <TextField
                                                fullWidth onKeyDown={(e) => { handleAddMail(e, e.target.value) }}
                                                style={{ fontFamily: "Work Sans" }} placeholder="Type email and press enter"
                                            />
                                        </div>
                                    </Grid>
                                </Grid>

                                <div style={{ margin: "15px 0 10px 0" }} >
                                    <Button onClick={handleAddEndpoint} variant="outlined" size="large"
                                        style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                    >
                                        Add Endpoint
                                    </Button>
                                </div>
                            </div>
                        </Paper>
                }
                <div style={{ marginTop: "20px" }} >
                    <Typography style={{ fontFamily: "Work Sans", fontSize: "1.2rem", color: "rgb(187, 183, 223)" }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: "7.5px" }} />
                                <span style={{ fontWeight: "600" }}>Endpoints Library</span>
                            </Grid>
                            {/*<Grid item>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#AA0023" }} />
                            </Grid>*/}
                        </Grid>
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div>
                        {
                            metrics ? [...metrics['listOfDownEPs'], ...metrics['listOfUpEPs']].map((ep) => {
                                return (
                                    <Accordion expanded={expanded === iRData[ep]['_id']}
                                        onChange={handleExandPanel(iRData[ep]['_id'])}
                                        style={{ padding: "5px", backgroundColor: "rgb(8, 7, 17)", backgroundImage: "none", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            style={{ padding: "7.5px 15px", color: "rgb(187, 183, 223)" }}
                                        >
                                            <Typography sx={{ width: '90%', flexShrink: 0, display: { lg: 'none', md: 'block' } }}>
                                                <Tooltip title={ep} arrow={true} style={{ fontFamily: "Work Sans" }} >
                                                    <Typography style={{ fontFamily: "Work Sans", overflow: "hidden" }}>
                                                        {
                                                            iRData[ep]['running'] === "Downtime" ?
                                                                <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                                : <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                        }
                                                        {ep.replace(/(^\w+:|^)\/\//, '').substring(0, 20)}
                                                    </Typography>
                                                </Tooltip>
                                            </Typography>
                                            <Typography sx={{ width: '40%', flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
                                                <Tooltip title={ep} arrow={true} style={{ fontFamily: "Work Sans" }} >
                                                    <Typography style={{ fontFamily: "Work Sans", overflow: "hidden" }}>
                                                        {
                                                            iRData[ep]['running'] === "Downtime" ?
                                                                <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                                : <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                        }
                                                        {ep.replace(/(^\w+:|^)\/\//, '').substring(0, 35)}
                                                    </Typography>
                                                </Tooltip>
                                            </Typography>
                                            <Typography sx={{ width: "20%", display: { xs: 'none', lg: 'block' } }} style={{ fontFamily: "Work Sans" }}>
                                                {
                                                    iRData[ep]['running'] === "Downtime" ?
                                                        <span style={{ margin: "0 0 0 10px", fontWeight: "400", padding: "4px 7px", border: "3px solid #AA0023", borderRadius: "75px" }}>
                                                            <FontAwesomeIcon icon={faCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                            {iRData[ep]['status']}
                                                        </span>
                                                        : <span style={{ margin: "0 0 0 10px", fontWeight: "400", padding: "4px 7px", border: "3px solid #3faf62", borderRadius: "75px" }}>
                                                            <FontAwesomeIcon icon={faCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                            {iRData[ep]['status']}
                                                        </span>
                                                }
                                            </Typography>
                                            <Typography sx={{ display: { xs: 'none', lg: 'block' } }} style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                Last Checked on {iRData[ep]['last-check-timestamp'].substring(0, iRData[ep]['last-check-timestamp'].indexOf("."))}
                                                <br />
                                                Routine check runs every {iRData[ep]['routine']} Hours
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails style={{ fontFamily: "Work Sans", padding: "15px 15px", color: "rgb(187, 183, 223)" }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="stretch"
                                                spacing={1}
                                            >
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Typography style={{ fontFamily: "Work Sans", overflow: "auto" }}>
                                                        {
                                                            iRData[ep]['running'] === "Downtime" ?
                                                                <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                                : <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                        }
                                                        <span style={{ fontWeight: "600", textDecoration: iRData[ep]['running'] === "Downtime" ? "underline #AA0023" : "underline #3faf62", textDecorationThickness: "3px" }}>{ep}</span> is
                                                        {iRData[ep]['running'] === "Downtime" ? <span> Down. Take appropriate action to avoid service disruption. </span> : <span> Running. You're good to go! </span>}
                                                    </Typography>
                                                    <Divider style={{ margin: "15px 0 10px 0" }} />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <Typography style={{ fontFamily: "Work Sans" }}>
                                                        Endpoint Name : <span style={{ fontWeight: "600", }}>{iRData[ep]['endpoint-name']}</span>
                                                    </Typography>
                                                    <Typography style={{ fontFamily: "Work Sans" }}>
                                                        Description : <span style={{ fontWeight: "600", }}>{iRData[ep]["description"]}</span>
                                                    </Typography>
                                                    <Typography style={{ fontFamily: "Work Sans" }}>
                                                        Routine Check : Every <span style={{ fontWeight: "600", }}>{iRData[ep]["routine"]}</span> Hours
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <Typography style={{ fontFamily: "Work Sans", margin: "0 0 5px 0" }}>
                                                        Server Response
                                                    </Typography>
                                                    <Paper variant="outlined" style={{ padding: "7.5px 10px" }} >
                                                        <Typography style={{ fontFamily: "Work Sans" }}>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                justifyContent="flex-start"
                                                                alignItems="center"
                                                                spacing={0.5}
                                                            >
                                                                <Grid item>
                                                                    <Spinner type="toggle" style={{ color: iRData[ep]['running'] === "Downtime" ? "#AA0023" : "#3faf62" }} />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography style={{ fontFamily: "Work Sans" }}>
                                                                        {iRData[ep]['status']} - {iRData[ep]['response']}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                justifyContent="flex-start"
                                                                alignItems="center"
                                                                spacing={0.5}
                                                            >
                                                                <Grid item>
                                                                    <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                                        🕔
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                                        Last checked at {iRData[ep]['last-check-timestamp']}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "5px" }}>
                                                    <Typography style={{ fontFamily: "Work Sans", overflow: "auto" }}>
                                                        <span style={{ marginRight: "5px" }}>
                                                            Mailing List
                                                        </span>
                                                        <span style={{}}>
                                                            {
                                                                iRData[ep]['mail-list'].map((mail) => {
                                                                    return (
                                                                        <Chip variant="filled" label={mail} size="small"
                                                                            avatar={<Avatar style={{ fontFamily: "Work Sans", fontWeight: "600", backgroundColor: "#fff4bd", color: "rgb(193 98 0 / 95%)" }}>{mail.substring(0, 1).toUpperCase()}</Avatar>}
                                                                            style={{ fontFamily: "Work Sans", backgroundColor: "rgb(193 98 0 / 95%)", color: "#fff4bd", marginRight: "3px" }}
                                                                        />
                                                                    );
                                                                })
                                                            }
                                                        </span>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "5px" }}>
                                                    <Divider style={{ margin: "10px 0 15px 0" }} />
                                                    <Typography style={{ fontFamily: "Work Sans", fontWeight: "600" }}>
                                                        <FontAwesomeIcon icon={faChartLine} style={{ marginRight: "7.5px" }} />
                                                        Past Activity
                                                    </Typography>
                                                    <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }} sx={{ display: { xl: 'none', xs: 'block' } }} >
                                                        Past Activities are only available on Large Screen Devices
                                                    </Typography>
                                                    <div style={{ marginTop: "15px", width: "100%", overflow: "auto", display: "flex", padding: "10px 0" }}>
                                                        {
                                                            iRData[ep]['reports'].reverse().map((report) => {
                                                                return (
                                                                    <>
                                                                        <Paper variant="outlined" style={{ padding: "7.5px 10px", minWidth: "33%", marginRight: "10px" }} sx={{ display: { xs: 'none', md: 'block' } }}>
                                                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem", margin: "2px 0" }}>
                                                                                {
                                                                                    report['running'] === "Downtime" ?
                                                                                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "7.5px", color: "#AA0023" }} />
                                                                                        : <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "7.5px", color: "#3faf62" }} />
                                                                                }
                                                                                {report['status']} - {report['response']}
                                                                            </Typography>
                                                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem", margin: "2px 0" }}>
                                                                                Response Time - <span style={{ fontWeight: "600" }}>{report['response-time']}s</span>
                                                                            </Typography>
                                                                            {
                                                                                report['redirects'] !== null ?
                                                                                    <Accordion
                                                                                        style={{ borderRadius: "5px", margin: "5px 0" }}
                                                                                    >
                                                                                        <AccordionSummary
                                                                                            expandIcon={<ExpandMoreIcon />}
                                                                                            aria-controls="panel1a-content"
                                                                                            id="panel1a-header"
                                                                                            style={{ margin: "0 0" }}
                                                                                        >
                                                                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>{report['redirects'].length} Redirect(s)</Typography>
                                                                                        </AccordionSummary>
                                                                                        <AccordionDetails style={{ margin: "0 0" }} >
                                                                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem" }}>
                                                                                                <center>
                                                                                                    {ep}
                                                                                                    {
                                                                                                        report['redirects'].map((url) => {
                                                                                                            return (
                                                                                                                <span>
                                                                                                                    <div>
                                                                                                                        <FontAwesomeIcon icon={faArrowDown} style={{ margin: "0 3px", color: "#3faf62" }} />
                                                                                                                    </div>
                                                                                                                    <div>{url.replace(/(^\w+:|^)\/\//, '')}</div>
                                                                                                                </span>
                                                                                                            );
                                                                                                        })
                                                                                                    }
                                                                                                </center>
                                                                                            </Typography>
                                                                                        </AccordionDetails>
                                                                                    </Accordion>
                                                                                    : <span>No Redirects</span>
                                                                            }
                                                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.8rem", margin: "2px 0" }}>
                                                                                Checked at {report['timestamp']}
                                                                            </Typography>
                                                                        </Paper>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "5px" }} >
                                                    {expanded === iRData[ep]['_id'] ? <ResponseTimeChart data={iRData[ep]['reports']} color={iRData[ep]['running'] === "Downtime" ? "#AA0023" : "#3faf62"} /> : undefined}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "5px" }} >
                                                    <Divider style={{ margin: "10px 0 15px 0" }} />
                                                    <Typography style={{ fontFamily: "Work Sans", fontWeight: "600" }}>
                                                        <FontAwesomeIcon icon={faCog} style={{ marginRight: "7.5px" }} />
                                                        Action Items
                                                    </Typography>
                                                    <div style={{ marginTop: "15px" }}>
                                                        <Grid
                                                            container
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            spacing={1}
                                                        >
                                                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                                                <Button onClick={() => { handleCheckUptime(ep) }} variant="outlined" size="large"
                                                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                                                >
                                                                    Check Uptime
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                                                <Button onClick={() => { handleGenerateOnRequestReport(ep) }} variant="outlined" size="large"
                                                                    style={{ width: "100%", fontFamily: "Work Sans", color: "rgb(187, 183, 223)" }}
                                                                >
                                                                    Generate Report
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                                                <Button onClick={() => { handleOpenDeleteBox(iRData[ep]['_id']); }} variant="outlined" size="large"
                                                                    style={{ width: "100%", fontFamily: "Work Sans", color: "#AA0023", borderColor: "#AA0023" }}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} style={{ margin: "0 5px 0 0" }} />
                                                                    Delete Endpoint
                                                                </Button>
                                                                <Dialog
                                                                    open={openDeleteBox === iRData[ep]['_id']}
                                                                    onClose={handleCloseDeleteBox}
                                                                    style={{ fontFamily: "Work Sans", borderRadius: "10px", padding: "10px" }}
                                                                >
                                                                    <DialogTitle id="alert-dialog-title" style={{ fontFamily: "Work Sans", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                                                                        Delete Endpoint {ep}
                                                                    </DialogTitle>
                                                                    <DialogContent style={{ fontFamily: "Work Sans", backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)" }}>
                                                                        <Divider style={{ margin: "0 0 15px 0", }} />
                                                                        <DialogContentText id="alert-dialog-description" style={{ fontFamily: "Work Sans", }}>
                                                                            Deleting this Endpoint would remove it from the EP Library and no routine check will be performed on it.
                                                                            <br />
                                                                            Are you sure you want to delete the endpoint?
                                                                        </DialogContentText>
                                                                    </DialogContent>
                                                                    <DialogActions style={{ backgroundColor: "rgb(8, 7, 17)", color: "rgb(187, 183, 223)", }}>
                                                                        <Button style={{ fontFamily: "Work Sans", color: "#FFF4BD", borderColor: "#FFF4BD" }} onClick={handleCloseDeleteBox}>Cancel</Button>
                                                                        <Button style={{ fontFamily: "Work Sans", }}
                                                                            onClick={() => { handleDeleteEP(ep) }} autoFocus
                                                                            variant="contained" color="error"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </DialogActions>
                                                                </Dialog>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            }) : <Typography style={{ fontFamily: "Work Sans", fontSize: "1rem" }}>All EPLib Endpoints are shown here!</Typography>
                        }
                    </div>
                </div>
            </Grid>
            {/*}
            <Grid item xs={4} >
                <Spinner type="dots2" style={{color: "rgb(187, 183, 223)"}} />
            </Grid>
             
                <Grid item xs={4} >
                    <Spinner type="moon" />
                </Grid>
            {*/}
        </Grid >
    );
}
