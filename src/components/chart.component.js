import React, { useState, useEffect } from 'react';
import { ReactChartJs } from '@cubetiq/react-chart-js';
import Spinner from "react-cli-spinners/dist";
import { Typography } from '@mui/material';


export default function ResponseTimeChart(props) {

    const [data, setData] = useState(props.data);
    const [color, setColor] = useState(props.color);
    const [responseTime, setResponseTime] = useState();
    const [tstampLabels, setTstampLabels] = useState();

    useEffect(() => {
        setData(props.data);
        setColor(props.color);
        var respTime = [];
        var tstamp = [];
        if (data !== undefined) {
            data.map((report) => {
                respTime.push(report['response-time']);
                tstamp.push(report["timestamp"].substring(0, report["timestamp"].indexOf(".")))
            })
            setTimeout(function () {
                setResponseTime(respTime);
                setTstampLabels(tstamp);
            }, 3000)
        }
    }, [])

    if (responseTime && tstampLabels) {
        return (
            <ReactChartJs
                chartConfig={{
                    type: 'line',
                    options: {
                        responsive: true,
                        title: {
                            display: false,
                            text: 'Monthly Payments',
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true,
                        },
                    },
                    data: {
                        datasets: [
                            {
                                label: 'Response Time (in sec)',
                                data: responseTime,
                                fill: false,
                                borderColor: color,
                            }
                        ],
                        labels: tstampLabels,
                    },
                }}
            />
        );
    } else {
        return (
            <center>
                <Spinner type="runner" style={{ fontSize: "2.5rem" }} />
                <Typography style={{ fontFamily: "Work Sans", fontSize: "1.5rem" }}>
                    Spinning Up a beautiful Chart!
                </Typography>
            </center>
        )
    }

}