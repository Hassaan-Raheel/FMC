import React, { useEffect, useState } from "react";
import "./DatabaseInsight.css";
import "../../Page.css";
import DatabaseHealth from "../../../Components/DatabaseInsightComponents/DatabaseHealth/DatabaseHealth";
import connectionsIcon from "../../../Assets/Images/connections.png";
import databaseIcon from "../../../Assets/Images/database.png";
import timeIcon from "../../../Assets/Images/time.png";
import restartIcon from "../../../Assets/Images/restart.png";
import { FaChartLine } from "react-icons/fa";
import heapIcon from "../../../Assets/Images/heap.png";
import cpuIcon from "../../../Assets/Images/cpu.png";
import ramIcon from "../../../Assets/Images/ram.png";
import totalRequestIcon from "../../../Assets/Images/requests.png";
import insertOptionIcon from "../../../Assets/Images/insertop.png";
import readLatencyIcon from "../../../Assets/Images/readlatency.png";
import writeLatency from "../../../Assets/Images/writelatency.png";
import nodeLogo from "../../../Assets/Images/node.png";
import mongodbLogo from "../../../Assets/Images/mongoDB.png";
import serverSize from "../../../Assets/Images/serversize.png";
import axios from "axios";
import { Url } from "../../../Services/Api";

const DatabaseInsight = () => {
  const [databaseData, setDatabaseData] = useState();
  const [serverData, setServerData] = useState();

  useEffect(() => {
    const fetchServerAndDatabaseData = async () => {
      const api = `/api/metrics`;
      try {
        const response = await axios.get(Url+api);
        console.log("database and server data", response);
        setDatabaseData(response.data.database);
        setServerData(response.data.server);
      } catch (error) {
        console.error("UnExpected Server Error", error);
      }
      
    };
    fetchServerAndDatabaseData();
  }, []);

  const analyticCardData = [
    {
      name: "Total Request",
      icon: totalRequestIcon,
      duration: "Last 7 Days",
      analyticalValue: databaseData?.totalRequests,
      analyticGroth: "20.23",
    },
    {
      name: "Insert Operations",
      icon: insertOptionIcon,
      duration: "Last 7 Days",
      analyticalValue: databaseData?.opcounters?.insert,
      analyticGroth: "20.23",
    },
    {
      name: "Read Latency",
      icon: readLatencyIcon,
      duration: "Last 7 Days",
      analyticalValue: databaseData?.opLatencies?.reads?.avgLatency?.value,
      units: databaseData?.opLatencies?.writes?.avgLatency?.unit,
      analyticGroth: databaseData?.opLatencies?.reads?.avgLatency?.status,
    },
    {
      name: "Write Latency",
      icon: writeLatency,
      duration: "Last 7 Days",
      analyticalValue: databaseData?.opLatencies?.writes?.avgLatency?.value,
      units: databaseData?.opLatencies?.writes?.avgLatency?.unit,
      analyticGroth: databaseData?.opLatencies?.writes?.avgLatency?.status,
    },
  ];

  const serverDataObj = [
    {
      name: "CPU",
      icon: cpuIcon,
      value: serverData?.cpuUsage?.totalCPU?.value,
      unit: serverData?.cpuUsage?.totalCPU?.unit,
      status: serverData?.cpuUsage?.totalCPU?.status,
    },
  ];

  return (
    <div className="DashboardPage">
      <div className="database-and-server-insight-main-container">
        <DatabaseHealth
          title={"Database Health"}
          typeLogo={mongodbLogo}
          timeCardTitle={"Up Time"}
          time={databaseData?.uptime}
          cardData={[
            {
              title: "Connections",
              icon: connectionsIcon,
              valueOne: databaseData?.connections?.current,
              valueTwo:
                databaseData?.connections?.available +
                databaseData?.connections?.current,
            },
            {
              title: "Database Size",
              icon: databaseIcon,
              valueOne: databaseData?.storage?.storageSize,
              valueTwo: databaseData?.storage?.allocated,
              unit: databaseData?.storage?.storageSizeUnit,
              unitTwo: databaseData?.storage?.allocatedUnit,
            },
          ]}
          cardLength={2}
          cardTitle={"Connection"}
          cardIcon={connectionsIcon}
          valueOne={20}
          valueTwo={50}
          // analyticCardLength={4}
          analyticData={analyticCardData}
          analyticTitle={"Total Order"}
          analyticDuration={"Last 7 Days"}
          analyticValue={236}
          analyticGroth={20.23}
          analyticIcon={<FaChartLine />}
          analyticWidth={"100%"}
        />

        <DatabaseHealth
          title={"Server Health"}
          typeLogo={nodeLogo}
          timeCardTitle={"Up Time"}
          time={serverData?.uptime}
          cardData={[
            {
              title: "Server Size",
              icon: serverSize,
              valueOne: serverData?.usedMemory.value,
              unit: serverData?.usedMemory.unit,
              valueTwo: serverData?.totalMemory?.value,
              unitTwo: serverData?.totalMemory?.unit,
            },
            {
              title: "HEAP",
              icon: heapIcon,
              // timeCount: serverData?.heapTotal?.value,
              // unit: serverData?.heapTotal?.unit,
              valueOne: serverData?.heapUsed.value,
              unit: serverData?.heapUsed.unit,
              valueTwo: serverData?.heapTotal?.value,
              unitTwo: serverData?.heapTotal?.unit,
            },
            { title: "Restart Count", icon: restartIcon, timeCount: 20 },
            { title: "Down time", icon: timeIcon, timeCount: "00:10:00" },
          ]}
          cardLength={1}
          cardTitle={"Connection"}
          cardIcon={connectionsIcon}
          valueOne={20}
          valueTwo={50}
          serverData={serverDataObj}
          userAndSystemData={serverData?.cpuUsage}
          // analyticData={analyticCardData}
          // analyticCardLength={4}
          analyticTitle={"Total Order"}
          analyticDuration={"Last 7 Days"}
          analyticValue={236}
          analyticGroth={20.23}
          analyticIcon={<FaChartLine />}
          analyticWidth={"100%"}
        />
      </div>
    </div>
  );
};

export default DatabaseInsight;
