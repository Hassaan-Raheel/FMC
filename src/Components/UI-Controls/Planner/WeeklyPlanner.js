import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeeklyPlanner.css";
import { FaUser } from "react-icons/fa";
import { Url } from "../../../Services/Api";

const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const getWeekDates = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + i);
        return date.toISOString().split("T")[0];
    });
};

const parseTimeRange = (timeRange) => {
    const [start, end] = timeRange.split(" - ");
    return { start, end };
};

const WeeklyPlanner = ({ onDataUpdate }) => {
    const [appointments, setAppointments] = useState([]);
    const weekDates = getWeekDates();
    const weekRange = `${weekDates[0]} to ${weekDates[6]}`;

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${Url}/api/v1/appointments/get-appointments`);

                if (response.data.success) {
                    const weeklyAppointments = response.data.data.filter(app => weekDates.includes(app.selectedDate));

                    const formattedAppointments = weeklyAppointments.map(app => {
                        const { start, end } = parseTimeRange(app.selectedSlot);

                        return {
                            id: app._id,
                            date: app.selectedDate,
                            startHour: start,
                            endHour: end,
                            customer: `${app.details.firstName} ${app.details.lastName}`,
                            image: "https://via.placeholder.com/40",
                            itemStatus: app.serviceType.charAt(0).toUpperCase() + app.serviceType.slice(1),
                            itemCategory: app.selectedCategories[0]?.name || "No Category"
                        };
                    });

                    setAppointments(formattedAppointments);
                    console.log("Appointments are:", formattedAppointments);
                    /* Pass data to parent component */
                    onDataUpdate(weekRange, formattedAppointments.length);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, [onDataUpdate]);

    return (
        <div className="planner">
            <div className="scroll-container">
                <div className="grid">
                    <div className="empty-cell"></div>
                    {weekDates.map((date, index) => (
                        <div key={date} className="day-header">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index]}
                            <sup className="WeeklyDate-Style">{date}</sup>
                        </div>
                    ))}

                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div className="hour-label">{hour}</div>
                            {weekDates.map((date) => (
                                <div key={`${date}-${hour}`} className="appointment-slot">
                                    <div className="slot-divider"></div>

                                    {appointments
                                        .filter(app => app.date === date && app.startHour === hour)
                                        .map((app, index, arr) => (
                                            <div
                                                key={app.id}
                                                className={`appointment ${arr.length > 1 ? "multiple-appointments" : ""}`}
                                                style={{
                                                    gridRow: arr.length > 1
                                                        ? index === 0 ? "1 / span 1" : "2 / span 1"
                                                        : `span ${hours.indexOf(app.endHour) - hours.indexOf(app.startHour) + 1}`
                                                }}
                                            >
                                                <div className="appointment-content">
                                                    <div className="content-row01">
                                                        <FaUser className="customer-img" />
                                                        <div className="content-row01-description">
                                                            <strong>{app.customer}</strong>
                                                            <span>{app.itemStatus}</span>
                                                        </div>
                                                    </div>

                                                    {/* Hide itemCategory if multiple appointments exist */}
                                                    {arr.length === 1 && (
                                                        <div className="appointment-catDetails">
                                                            <span>{app.itemCategory}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyPlanner;