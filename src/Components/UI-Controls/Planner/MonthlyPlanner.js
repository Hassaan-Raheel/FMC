import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MonthlyPlanner.css";
import { FaUser } from "react-icons/fa";
import { Url } from "../../../Services/Api";

const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const getMonthDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return Array.from({ length: lastDay.getDate() }, (_, i) => {
        const date = new Date(year, month, i + 1);
        return date.toISOString().split("T")[0];
    });
};

const parseTimeRange = (timeRange) => {
    const [start, end] = timeRange.split(" - ");
    return { start, end };
};

const MonthlyPlanner = ({ onDataUpdate }) => {
    const [appointments, setAppointments] = useState([]);
    const monthDates = getMonthDates();
    const monthRange = `${monthDates[0]} to ${monthDates[monthDates.length - 1]}`;

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${Url}/api/v1/appointments/get-appointments`);

                if (response.data.success) {
                    const monthlyAppointments = response.data.data.filter(app => monthDates.includes(app.selectedDate));

                    const formattedAppointments = monthlyAppointments.map(app => {
                        const { start, end } = parseTimeRange(app.selectedSlot);
                        let adjustedStart = start;
                        let isTimingIssue = false;

                        // Fix incorrect AM times
                        const incorrectTimeMapping = {
                            "12:00 AM": "12:00 PM",
                            "01:00 AM": "01:00 PM",
                            "02:00 AM": "02:00 PM",
                            "03:00 AM": "03:00 PM",
                            "04:00 AM": "04:00 PM",
                            "05:00 AM": "05:00 PM",
                            "06:00 AM": "06:00 PM",
                            "07:00 AM": "07:00 PM"
                        };

                        if (incorrectTimeMapping[start]) {
                            adjustedStart = incorrectTimeMapping[start];
                            isTimingIssue = true;
                        }

                        return {
                            id: app._id,
                            date: app.selectedDate,
                            startHour: adjustedStart,
                            endHour: end,
                            customer: `${app.details.firstName} ${app.details.lastName}`,
                            image: "https://via.placeholder.com/40",
                            itemStatus: app.serviceType.charAt(0).toUpperCase() + app.serviceType.slice(1),
                            itemCategory: app.selectedCategories[0]?.name || "No Category",
                            isTimingIssue,
                        };
                    });

                    setAppointments(formattedAppointments);
                    console.log("Total Appointments:", formattedAppointments);
                    /* Get the total appointments count */
                    const totalAppointments = formattedAppointments.length;

                    /* Get current month in "March, 2025" format */
                    const currentDate = new Date();
                    const formattedMonth = currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    });

                    /* Send data to parent component */
                    if (onDataUpdate) {
                        onDataUpdate({ totalAppointments, formattedMonth });
                    }
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, [onDataUpdate]);

    return (
        <div className="MonthlyPlanner">
            <div className="Monthly-Scroll-Container">
                <div className="MonthlyGrid">
                    <div className="empty-cell"></div>
                    {monthDates.map((date) => (
                        <div key={date} className="Monthly-Day-Header">
                            {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                            <sup className="date-style">{date}</sup>
                        </div>
                    ))}

                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div className="Monthly-Hour-Label">{hour}</div>
                            {monthDates.map((date) => {
                                const dailyAppointments = appointments.filter(
                                    (app) => app.date === date && app.startHour === hour
                                );

                                return (
                                    <div key={`${date}-${hour}`} className="Monthly-Appointment-Slot">
                                        <div className="Monthly-Slot-Divider"></div>

                                        {/* Vertical stacking of appointments */}
                                        {dailyAppointments.length > 0 && (
                                            <div className="Monthly-Appointment-Stack">
                                                {dailyAppointments.map((app, index) => (
                                                    <div key={app.id} className="Monthly-Appointment">
                                                        <div className="Monthly-Appointment-Content">
                                                            <div className="Monthly-Content-Row01">
                                                                <FaUser className="MonthCustomer-img" />
                                                                <div className="MonthlyContent-Row01-Description">
                                                                    <strong>{app.customer}</strong>
                                                                    <span>{app.itemStatus}</span>
                                                                </div>
                                                            </div>

                                                            {/* Hide MonthlyAppointment-catDetails if more than one appointment exists */}
                                                            {dailyAppointments.length === 1 && (
                                                                <div className="MonthlyAppointment-catDetails">
                                                                    {app.isTimingIssue ? (
                                                                        <div className="Timing-Issue">⚠️ Timing Issue</div>
                                                                    ) : (
                                                                        <span>{app.itemCategory}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default MonthlyPlanner;