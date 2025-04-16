import React from 'react'
import './DatabaseHealth.css'
import AnalyticCard from '../AnalyticCard/AnalyticCard';
import Counter from '../Counter/Counter';

const DatabaseHealth = (
    {
        title,
        typeLogo,
        timeCardTitle,
        time,
        cardData,
        analyticData,
        analyticWidth,
        serverData,
        userAndSystemData,
    }) => {

    function formatUptime(seconds) {
        seconds = Math.floor(Number(seconds))
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');

        return `${hours}:${minutes}:${secs}`;
    }

    return (
        <div className='database-health-main-container'>

            <div className='database-health-head-container'>
                <h3>{title}</h3>
                <img src={typeLogo} alt='logo' />
            </div>

            {title === 'Server Health' ? (
                <div className='server-health-upper-container'>

                    <div className='database-uptime-card'>
                        <h3>{timeCardTitle}</h3>

                        {time !== "" && time !== null && time !== undefined && !isNaN(Number(time)) ? (
                            <div className="database-up-time-clock-container">
                                <span> {formatUptime(Number(time))}</span>
                            </div>
                        ) : (
                            <div className='uptime-shimmer'></div>
                        )}

                    </div>

                    {serverData && serverData.map((item, index) => (
                        <div key={index} className='db-connections-card'>
                            <div className='db-connection-card-head'>
                                <h3>{item.name}</h3>
                                <img src={item.icon} alt='icon' />
                            </div>
                            {item.value !== "" && item.value !== null && item.value !== undefined && !isNaN(Number(item.value)) ? (
                                <div className='db-connection-card-value-container'>
                                    <h3 className='server-health-count-and-timer'>
                                        {/* <Counter target={item.value} speed={3} dynamicClass={'Card-counter'} /> */}
                                        {item.value}
                                        {item.unit}
                                    </h3>
                                    <div className={`CardGrowth positive`}>
                                        {item.status}
                                    </div>
                                </div>
                            ) : (
                                <div className='card-shimmer-container'>
                                    <div className='card-value-shimmer'></div>
                                    <div className='card-status-shimmer'></div>
                                </div>
                            )}


                        </div>
                    ))}

                    <div className='db-connections-card'>
                        <div className='user-and-system-usage'>
                            <h3>User Usage</h3>
                            <span className='user-and-system-data'>
                                {userAndSystemData?.userCPU?.value !== "" && userAndSystemData?.userCPU?.value !== null && userAndSystemData?.userCPU?.value !== undefined && !isNaN(Number(userAndSystemData?.userCPU?.value)) ? (
                                    <>
                                        <p>{userAndSystemData?.userCPU?.value}{userAndSystemData?.userCPU?.unit}</p>
                                        <div className={`CardGrowth positive`}>
                                            {userAndSystemData?.userCPU?.status}
                                        </div>
                                    </>
                                ) : (
                                    <div className='usage-value-and-status-container'>
                                        <div className='usage-value-shimmer'></div>
                                        <div className='usage-status-shimmer'></div>
                                    </div>
                                )}

                            </span>
                        </div>
                        <div className='user-and-system-usage'>
                            <h3>System Usage</h3>
                            <span className='user-and-system-data'>
                                {userAndSystemData?.systemCPU?.value !== "" && userAndSystemData?.systemCPU?.value !== null && userAndSystemData?.systemCPU?.value !== undefined && !isNaN(Number(userAndSystemData?.systemCPU?.value)) ? (
                                    <>
                                        <p>{userAndSystemData?.systemCPU?.value}{userAndSystemData?.systemCPU?.unit}</p>
                                        <div className={`CardGrowth positive`}>
                                            {userAndSystemData?.systemCPU?.status}
                                        </div>
                                    </>
                                ) : (
                                    <div className='usage-value-and-status-container'>
                                        <div className='usage-value-shimmer'></div>
                                        <div className='usage-status-shimmer'></div>
                                    </div>
                                )}

                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}

            <div className='db-details-second-layer'>

                {title === 'Database Health' ? (
                    <div className='database-uptime-card'>
                        <h3>{timeCardTitle}</h3>
                        {time !== "" && time !== null && time !== undefined && !isNaN(Number(time)) ? (
                            <div className="database-up-time-clock-container">
                                <span> {formatUptime(Number(time))}</span>
                            </div>
                        ) : (
                            <div className='uptime-shimmer'></div>
                        )}

                    </div>
                ) : (<></>)}

                {cardData.map((item, index) => (
                    <div key={index} className='db-connections-card'>
                        <div className='db-connection-card-head'>
                            <h3>{item.title}</h3>
                            <img src={item.icon} alt='connection icon' />
                        </div>
                        <div className='db-connection-count-container'>

                            {
                                item.valueOne !== "" &&
                                    item.valueOne !== null &&
                                    item.valueOne !== undefined &&
                                    !isNaN(Number(item.valueOne))  ? (
                                    item.timeCount && item.title !== 'Down time'
                                        ? <h3 className='db-performance-count-and-timer'>
                                            <Counter
                                                target={item.timeCount}
                                                speed={3} dynamicClass={'Card-counter'}
                                            />{item.unit}
                                        </h3>
                                        : item.title === 'Down time'
                                            ? <p className='db-performance-count-and-timer'>
                                                {item.timeCount}
                                            </p> :
                                            <span>
                                                {Number.isInteger(Number(item.valueOne)) ? item.valueOne : Number(item.valueOne).toFixed(2)}
                                                <p>
                                                    out of {item.valueTwo} {item.unitTwo}
                                                </p>
                                            </span>
                                ) : (
                                    <div className='db-and-server-values-shimmer'></div>
                                )}

                        </div>
                    </div>
                ))}
            </div>

            <div className='analytic-cards-main-container'>
                {analyticData && analyticData.map((item, index) => (
                    <AnalyticCard
                        key={index}
                        title={item.name}
                        duration={item.duration}
                        value={item.analyticalValue}
                        growth={item.analyticGroth}
                        unit={item.units}
                        icon={item.icon}
                        width={analyticWidth}
                    />
                ))}
            </div>

        </div>
    )
}

export default DatabaseHealth
