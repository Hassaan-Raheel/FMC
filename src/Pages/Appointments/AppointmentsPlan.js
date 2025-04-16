import React, { useState, useEffect } from "react";
import TodayPlanner from "../../Components/UI-Controls/Planner/TodayPlanner";
import WeeklyPlanner from "../../Components/UI-Controls/Planner/WeeklyPlanner";
import CustomBtn from "../../Components/UI-Controls/Buttons/Btn";
import SearchBar from "../../Components/UI-Controls/SearchBar/Search";
import searchIcon from "../../Assets/Images/Search Bar 20 x 20.png";
import ShimmerLoader from "../../Components/UI-Controls/Loader/ShimmerLoader";
import MonthlyPlanner from "../../Components/UI-Controls/Planner/MonthlyPlanner";

const AppointmentsPlanner = () => {
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [todayDate, setTodayDate] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setLoading(true);
  };

  const handleDataUpdate = (date, count) => {
    setTodayDate(date);
    setTotalAppointments(count);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleWeeklyDataUpdate = (weekDates, totalAppointments) => {
    let dates = Array.isArray(weekDates) ? weekDates : weekDates.split(" to ");
    const startOfWeek = new Date(dates[0]).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const endOfWeek = new Date(dates[1]).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setDateRange(`${startOfWeek} - ${endOfWeek}`);
    setTotalAppointments(totalAppointments);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleMonthlyData = ({ totalAppointments, formattedMonth }) => {
    setDateRange(formattedMonth);
    setTotalAppointments(totalAppointments);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="AllAppointments-Layout">
      <div className="Appointments-Row01">
        <div className="Appointments-1stRow">
          <div className="Appointments-Title">Appointments Planner</div>
        </div>
      </div>

      <div className="Appointments-Row01">
        <div className="Appointments-2ndRow">
          <div className="Appointments-2ndRow-First">
            <div className="Appointments-Filters-Section">
              <CustomBtn
                label="Today"
                className={`FilterBtn-TodayAppointments ${selectedFilter === "today" ? "selected-btn" : ""}`}
                onClick={() => handleFilterClick("today")}
              />
              <CustomBtn
                label="This Week"
                className={`FilterBtn-WeekAppointments ${selectedFilter === "week" ? "selected-btn" : ""}`}
                onClick={() => handleFilterClick("week")}
              />
              <CustomBtn
                label="This Month"
                className={`FilterBtn-WeekAppointments ${selectedFilter === "month" ? "selected-btn" : ""}`}
                onClick={() => handleFilterClick("month")}
              />
            </div>
            <div className="SearchBar-Section">
              <SearchBar icon={searchIcon} placeholder="Search by name" />
            </div>
          </div>

          <div className="Appointments-2ndRow-First">
            <div className="Date-Section">
              <div className="Date-Title">
                {loading ? <ShimmerLoader width="200px" height="23.5px" borderRadius="20px" /> :
                  selectedFilter === "today" ? todayDate : dateRange}
              </div>
            </div>
            <div className="TotalAppointments-Section">
              <div className="TotalAppointments-Title">
                {loading ? <ShimmerLoader width="150px" height="23.5px" borderRadius="20px" /> : `${totalAppointments} Appointments`}
              </div>
            </div>
          </div>

          <div className="Appointments-Planner-Section">
            <div className="Appointments-Planner-Section">
              {selectedFilter === "today" ? (
                <TodayPlanner onDataUpdate={handleDataUpdate} />
              ) : selectedFilter === "week" ? (
                <WeeklyPlanner onDataUpdate={handleWeeklyDataUpdate} />
              ) : (
                <MonthlyPlanner onDataUpdate={handleMonthlyData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPlanner;