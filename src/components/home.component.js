import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";

export default function Home() {

    const [iRData, setIRData] = useState();
    const [username, setUsername] = useState(window.sessionStorage.getItem("email"))
    const [password, setPassword] = useState(window.sessionStorage.getItem("password"))
    const [token, setToken] = useState(window.sessionStorage.getItem("token"))


    function getIRStatusData(username, password) {
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
            setIRData(res)
        })
    }

    useEffect(() => {
        setUsername(window.sessionStorage.getItem("email"));
        setPassword(window.sessionStorage.getItem("password"));
        setToken(window.sessionStorage.getItem("token"));
        getIRStatusData(username, password)
    }, [])

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

        })
    }

    return (
        <Paper elevation={5} >
            {
                iRData ? true : false
            }
        </Paper >
    );
}

