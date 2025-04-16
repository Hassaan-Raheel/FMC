import React from 'react'
import './UserInfo.css';
import menuDots from '../../../Assets/Images/Selector 20 X 20.png'
import userVector from '../../../Assets/check-images/user-vector.jpeg'
import ReactApexChart from 'react-apexcharts';

const UserInfo = () => {
    // const [state, setState] = React.useState({

    //     series: [70],
    //     options: {
    //         chart: {
    //             height: 350,
    //             type: 'radialBar',
    //         },
    //         plotOptions: {
    //             radialBar: {
    //                 hollow: {
    //                     size: '70%',
    //                 }
    //             },
    //         },
    //         labels: ['Cricket'],
    //     },


    // });
    
//     const [state, setState] = React.useState({
//     series: [30], // Example data for the radial bar
//     options: {
//       chart: {
//         height: 250,
//         type: 'radialBar',
//       },
//       plotOptions: {
//         radialBar: {
//           hollow: {
//             size: '70%',
//             background: 'transparent',
//           },
//           track: {
//             background: '#f4f4f4', // Track background color
//             strokeWidth: '1px', // 1px track border
//           },
//           dataLabels: {
//             show: false, // Hide default labels
//           },
//         },
//       },
//       stroke: {
//         lineCap: 'round',
//         width: 1, // Stroke width for the radial bar
//       },
//       labels: ['Cricket'],
//     },
//   });

    const [state, setState] = React.useState({
    series: [30], // Example data for the radial bar
    options: {
      chart: {
        height: 200,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '100%',
            background: '#fff', // White background for the hollow section
            borderWidth: 1, // 1px border for the hollow section
            borderColor: '#4457C5', // 1px border color for the hollow section
          },
          track: {
            background: '#f4f4f4', // Track background color
            strokeWidth: 1, // 1px width for the track border
          },
          dataLabels: {
            show: false, // Hide default labels
          },
        },
      },
      stroke: {
        lineCap: 'round',
        width: 1, // 1px width for the radial bar stroke
        colors: ['#4457C5'], // Color of the radial bar stroke
      },
      labels: ['Cricket'],
    },
  });
    
    return (
      <div className='user-info-main-container'>
        <div className='user-info-inner-container'>
            <div className='user-info-head'>
                <p>Statistics</p>
                {/* <img src={menuDots} alt='menu dots' /> */}
            </div>
            <div className='user-info-body'>
                <div className='user-info-user-image'>
                    {/* <img src={userVector} alt='user-vector' className='user-info-vectore-image' /> */}
                    <div id="chart" className="radial-chart-container">
                        <span className='user-profile-complete-tag'>
                            30%
                        </span>
                        <ReactApexChart
                            options={state.options}
                            series={state.series}
                            type="radialBar"
                            height={200}
                        />
                        <img
                            src={userVector}
                            alt="user profile"
                            className="centered-user-image"
                        />
                    </div>
                    <div id="html-dist"></div>
                </div>
                <h3 className='user-info-greeting'>Good Morning Jason</h3>
                <p className='user-info-message'>Continue learning to achieve your target</p>
            </div>
        </div>
      </div>
    )
}

export default UserInfo
