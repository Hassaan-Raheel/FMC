import React, { useEffect, useState, useRef } from 'react'
import './ServerLogs.css'
import '../../Page.css';
import topApiIcon from '../../../Assets/Images/top-api.png';
import distributionsIcon from '../../../Assets/Images/distributions.png';
import methodsIcon from '../../../Assets/Images/methods.png'
import AnalyticCard from '../../../Components/DatabaseInsightComponents/AnalyticCard/AnalyticCard';
import { LineChartOutlined, BarChartOutlined } from '@ant-design/icons'
import ServerLogChart from '../../../Components/UI-Controls/Charts/ColumnChart/ServerLogChart';
import axios from 'axios';
import { Url } from '../../../Services/Api';

import DataTable from "react-data-table-component";


const ServerLogs = () => {
    const serverLogsCardData = [
        { title: `Top Api's`, icon: topApiIcon, value: 0 },
        { title: `Status Code Distribution`, icon: distributionsIcon, value: 0 },
        { title: `Avg Response Time`, icon: distributionsIcon, value: 0 },
        { title: `Frequency of methods`, icon: methodsIcon, value: 0 },
    ]

    const [selectChart, setSelectChart] = useState('column-chart')
    const handleChartSelect = (chart) => {
        setSelectChart(chart)
    }

    const [logsData, setLogsData] = useState([]);
    const handleSelverLogsData = async () => {
        const formattedDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const api = `/logs?date=${formattedDate}`;
        try {
            const response = await axios.get(Url+api);
            const validLogs = response.data.filter(log => !log.error);
            console.log("response inside function", response)
            const formateLogs = validLogs.map(log => ({
                timestamp: new Date(log.message.timestamp).toLocaleTimeString('en-US', {
                    timeZone: 'UTC',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true // Ensures AM/PM format
                }),
                // timestamp: log.message.timestamp,
                duration: log.message.duration,
                ip: log.message.ip,
                method: log.message.method,
                route: log.message.route,
                status: log.message.status,
                userAgent: log.message.userAgent
            }))
            setLogsData(formateLogs)

        } catch (error) {
            console.error("Error fetching server logs:", error.message);
        }
    }

    useEffect(() => {handleSelverLogsData()}, [])
    useEffect(() => {console.log("logs data", logsData)}, [logsData])


    // Extract hours dynamically from API response
    const categories = [
        "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
        "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", 
    ];

    const logCounts = Object.fromEntries(categories.map(hour => [hour, 0]));

    logsData.forEach(log => {
        let timestamp = log.timestamp; // e.g., "12:18:52 PM"
        let hourMatch = timestamp.match(/(\d{1,2}):\d{2}:\d{2} (AM|PM)/);

        if (hourMatch) {
            let hour = hourMatch[1] + hourMatch[2]; // Extracted as "12PM", "3AM", etc.
            if (logCounts.hasOwnProperty(hour)) {
                logCounts[hour]++; // Increment count for that hour
            }
        }
    });

    // Prepare seriesData for chart
    const seriesData = categories.map(hour => logCounts[hour]);

    // Convert hoursMap to structured chart data
    const chartData = { 
        categories,
        seriesData
    };

    // Table Data
    

    // const [data, setData] = useState([
    //     {
    //         status: 200,
    //         timestamp: "01:49:27 PM",
    //         method: "GET",
    //         route: "/api/v1/analytics/product-analytics",
    //         duration: "1493ms",
    //         ip: "119.73.96.201",
    //     },
    //     {
    //         status: 500,
    //         timestamp: "02:10:45 PM",
    //         method: "POST",
    //         route: "/api/v1/users/login",
    //         duration: "2100ms",
    //         ip: "192.168.1.101",
    //     },
    // ])

    const [data, setData] = useState([]); // Initial 10 logs

    useEffect(() => {
        setData([...logsData].reverse().slice(0, 10))
        console.log("data logs for table", logsData)
    }, [logsData])

    const [hasMore, setHasMore] = useState(true);
    const tableRef = useRef(null);

    useEffect(() => { console.log("data after set ", data) }, [data])

    // ✅ Infinite Scroll Logic
    const handleScroll = () => {
        if (!tableRef.current || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = tableRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 20) {
            loadMoreData();
        }
    };

    const loadMoreData = () => {
        const nextData = logsData.slice(data.length, data.length + 10);
        if (nextData.length === 0) {
            setHasMore(false);
        } else {
            setData((prevData) => [...prevData, ...nextData]);
        }
    };

    useEffect(() => {
        const tableElement = tableRef.current;
        if (tableElement) {
            tableElement.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (tableElement) {
                tableElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    console.log("data for table", data)

    // ✅ Column Definitions
    const columns = [
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <span
                    style={{
                        backgroundColor:
                            row.status >= 500
                                ? "#FFEBEE"
                                : row.status >= 400
                                    ? "#FFF3E0"
                                    : "#E8F5E9",
                        color:
                            row.status >= 500 ? "#D32F2F" : row.status >= 400 ? "#F57C00" : "#388E3C",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                    }}
                >
                    {row.status}
                </span>
            ),
        },
        { name: "Time", selector: (row) => row.timestamp, sortable: true },
        { name: "Method", selector: (row) => row.method, sortable: true },
        { name: "Route", selector: (row) => row.route, sortable: true },
        { name: "Duration", selector: (row) => row.duration, sortable: true },
        { name: "IP", selector: (row) => row.ip, sortable: true },
    ];

    // Custom Styles for Transparent Background and Left Alignment
    const customStyles = {
        table: {
            style: {
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Transparent background
            },
        },
        headRow: {
            style: {
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                fontWeight: "bold",
                fontSize: "15px",
                textAlign: "center",
                position: "sticky",
                top: 0,
                zIndex: 1000, // Ensure it's above the body rows
            },
        },
        headCells: {
            style: {
                justifyContent: "center", // Default center
                paddingLeft: "10px",
                position: "sticky",
                top: 0,
                zIndex: 999,
            },
        },
        rows: {
            style: {
                backgroundColor: "transparent",
                textAlign: "center", // Align row text to the start (left)
            },
        },
        cells: {
            style: {
                justifyContent: "center", // Align body column text to the left
                paddingLeft: "10px",
            },
        },
        // ✅ Fix: Ensure "Route" column is left-aligned in both head and body
        cellsConditionalStyles: [
            {
                when: (column) => column.name === "Route", // Target "Route" header
                style: {
                    justifyContent: "start", // Align header left
                    paddingLeft: "10px",
                },
            },
            {
                when: (row) => row.route, // Target "Route" body cells
                style: {
                    textAlign: "start", // Align left
                    paddingLeft: "10px",
                },
            },
        ],
    };
    
    return (
        <div className="DashboardPage">
            <div className='server-logs-main-container'>

                <div className='server-logs-card-and-chart-section'>

                    <div className='server-logs-cards-and-head'>

                        <div className='server-log-head-section'>
                            <h3>Server Logs</h3>
                        </div>

                        <div className='server-log-cards-container'>
                            {serverLogsCardData.map((item, index) => (
                                <AnalyticCard
                                    title={item.title}
                                    value={item.value}
                                    icon={item.icon}
                                    width={'100%'}
                                />
                            ))}

                        </div>

                    </div>

                    <div className='server-logs-chart-container'>
                        <div className='server-log-chart-icons-container'>
                            <LineChartOutlined className={`server-log-icon ${selectChart === 'line-chart' ? 'active-chart-icon' : ''}`} onClick={() => handleChartSelect('line-chart')} />
                            <BarChartOutlined className={`server-log-icon ${selectChart === 'column-chart' ? 'active-chart-icon' : ''}`} onClick={() => handleChartSelect('column-chart')} />
                        </div>
                        <ServerLogChart data={chartData} selectedChart={selectChart} /> 
                    </div>

                </div>

                <div className='server-logs-table-section'>
                    <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        fixedHeader
                        fixedHeaderScrollHeight="410px"
                        customStyles={customStyles}
                        ref={tableRef}
                    />
                </div>
            </div>
        </div>
    )
}

export default ServerLogs
