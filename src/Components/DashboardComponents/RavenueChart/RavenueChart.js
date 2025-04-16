// import React, {useState} from 'react'
// import './RavenueChart.css';
// import ReactApexChart from 'react-apexcharts';
// import { CiExport } from "react-icons/ci";

// const RavenueChart = () => {
//     const [state, setState] = React.useState({
//         series: [{
//             name: 'series1',
//             data: [20, 30, 40, 50, 60, 70, 80]
//         },
//             // {
//             //     name: 'series2',
//             //     data: [11, 32, 45, 32, 34, 52, 41]
//             // }
//         ],
//         options: {
//             chart: {
//                 height: 350,
//                 type: 'area'
//             },
//             // title: {
//             //     ,
//             //     align: 'left'
//             // },
//             dataLabels: {
//                 enabled: false
//             },
//             stroke: {
//                 curve: 'smooth'
//             },
//             xaxis: {
//                 type: 'datetime',
//                 categories: ["2018-09-19T04:50:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T05:30:00.000Z"]
//             },
//             tooltip: {
//                 x: {
//                     format: 'dd/MM/yy HH:mm'
//                 },
//             },
//         },


//     });
//     const daysData = [
//         {title: '1H'},
//         {title: '1D'},
//         {title: '7D'},
//         {title: '1M'},
//         {title: '1Y'},
//     ]

//     const [daySelect, setDaySelect] = useState(0);
//     const handleDaySelect = (index) => {
//         setDaySelect(index);
//     }

//     // const [state, setState] = React.useState({
//     //     series: [{
//     //         name: 'series1',
//     //         data: [20, 30, 40, 50, 60, 70, 80]
//     //     }],
//     //     options: {
//     //         chart: {
//     //             height: 350,
//     //             type: 'area'
//     //         },
//     //         dataLabels: {
//     //             enabled: false
//     //         },
//     //         stroke: {
//     //             curve: 'smooth'
//     //         },
//     //         xaxis: {
//     //             type: 'datetime',
//     //             categories: [
//     //                 "2018-09-19T04:50:00.000Z",
//     //                 "2018-09-19T05:30:00.000Z",
//     //                 "2018-09-19T05:30:00.000Z",
//     //                 "2018-09-19T05:30:00.000Z",
//     //                 "2018-09-19T05:30:00.000Z",
//     //                 "2018-09-19T05:30:00.000Z",
//     //                 "2018-09-19T05:30:00.000Z"
//     //             ]
//     //         },
//     //         yaxis: {
//     //             min: 40 // Set the minimum value for the y-axis
//     //         },
//     //         tooltip: {
//     //             x: {
//     //                 format: 'dd/MM/yy HH:mm'
//     //             },
//     //         },
//     //     },
//     // });


//     return (
//         <div className='ravenue-chart-main-container'>
//             <div className='ravenue-chart-inner-container'>
//                 <div className='revenue-chart-head'>
//                     <div className='revenue-chart-head-details'>
//                         <p>Total Sales Revenue</p>
//                         <h3>$1,587,000</h3>
//                     </div>
//                     <div className='revenue-chart-head-export-options'>
//                         <div className='days-data'>
//                             {
//                                 daysData.map((item, index) => (
//                                     <button 
//                                         onClick={() => handleDaySelect(index)}
//                                         key={index}
//                                         className={`days-data-btn ${daySelect === index ? 'active-day-select' : ''}`}
//                                     >
//                                         {item.title}
//                                     </button>
//                                 ))
//                             }
//                         </div>
//                         <button className='export-btn'>
//                             <CiExport size={20} />
//                             Export
//                         </button>
//                     </div>
//                 </div>
//                 <div id="chart">
//                     <ReactApexChart options={state.options} series={state.series} type="area" height={350} width="100%" />
//                 </div>
//                 <div id="html-dist"></div>
//             </div>
//         </div>
//     )
// }

// export default RavenueChart


import React, {useState} from "react";
import './RavenueChart.css';
import Chart from 'react-apexcharts';
import { CiExport } from "react-icons/ci";

const RavenueChart = () => {



    const daysData = [
        {title: '1H'},
        {title: '1D'},
        {title: '7D'},
        {title: '1M'},
        {title: '1Y'},
    ]

    const [daySelect, setDaySelect] = useState(0);
    const handleDaySelect = (index) => {
        setDaySelect(index);
    }

    const options = {
        chart: {
            type: "line",
            toolbar: {
                show: true,
                tools: {
                    download: true,
                },
            },
        },

        stroke: {
            curve: "smooth",
            width: 2,
        },
        colors: ["#000000", "#FF0000"], // Black and red lines
        markers: {
            size: 4
        },

        xaxis: {
            categories: ["", "Text", "Text", "Text", "Text"],
        },
        yaxis: {
            min: 0,
            max: 120,
            tickAmount: 6,
        },

        tooltip: {
            shared: true,
        },


    }

    const series = [
        {
            name: "Total Revenue",
            data: [40, 100, 20, 90, 60],
        },
        {
            name: "Total Profit",
            data: [20, 40, 60, 80, 100],
        },
    ];

    return (
        <div className="ravenue-chart-main-container">
            <div className="ravenue-chart-header">
                <div className="ravenue-chart-headings">
                    <h2>Total Sales Revenue</h2>
                    <p style={{ fontSize: "24px", margin: "0" }}>$1,587,000</p>
                </div>

                <div className='revenue-chart-head-export-options'>
                        <div className='days-data'>
                             {
                                daysData.map((item, index) => (
                                    <button 
                                        onClick={() => handleDaySelect(index)}
                                        key={index}
                                        className={`days-data-btn ${daySelect === index ? 'active-day-select' : ''}`}
                                     >
                                         {item.title}
                                     </button>
                                ))
                            }
                        </div>
                         <button className='export-btn'>
                             <CiExport size={20} />
                             Export
                         </button>
                     </div>

            </div>
            <div>

            <Chart options={options} series={series} type="line" height={350} />
            </div>
        </div>
    )
}

export default RavenueChart