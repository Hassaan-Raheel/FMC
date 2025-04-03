import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Planner.css";
import { FaUser } from "react-icons/fa";
import { Url } from "../../../Services/Api";

const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM",
    "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const slots = ["Slot 1", "Slot 2", "Slot 3", "Slot 4", "Slot 5", "Slot 6", "Slot 7"];

const TodayPlanner = ({ onDataUpdate }) => {
    const [appointments, setAppointments] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${Url}/api/v1/appointments/get-appointments`);

                if (response.data.success) {
                    const todayAppointments = response.data.data.filter(app => app.selectedDate === today);

                    const appointmentGroups = {};
                    todayAppointments.forEach(app => {
                        const hour = app.selectedSlot.split(" - ")[0];
                        if (!appointmentGroups[hour]) {
                            appointmentGroups[hour] = [];
                        }
                        appointmentGroups[hour].push(app);
                    });

                    const formattedAppointments = [];
                    Object.keys(appointmentGroups).forEach(hour => {
                        appointmentGroups[hour].forEach((app, index) => {
                            formattedAppointments.push({
                                id: app._id,
                                hour,
                                slot: `Slot ${index + 1}`,
                                customer: `${app.details.firstName} ${app.details.lastName}`,
                                image: "https://via.placeholder.com/40",
                                itemStatus: app.serviceType,
                                itemCategory: app.selectedCategories[0]?.name || "No Category"
                            });
                        });
                    });

                    setAppointments(formattedAppointments);
                    console.log("Appointments with assigned slots:", formattedAppointments);
                    onDataUpdate(today, formattedAppointments.length);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, [onDataUpdate, today]);

    return (
        <div className="planner">
            <div className="scroll-container">
                <div className="grid">
                    <div className="empty-cell"></div>

                    {/* Slot Headers */}
                    {slots.map((slot) => (
                        <div key={slot} className="slot-header">{slot}</div>
                    ))}

                    {/* Time Rows */}
                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div className="hour-label">{hour}</div>

                            {slots.map((slot) => (
                                <div key={`${hour}-${slot}`} className="appointment-slot">
                                    <div className="slot-divider"></div>

                                    {appointments
                                        .filter(app => app.hour === hour && app.slot === slot)
                                        .map((app) => (
                                            <div key={app.id} className="appointment">
                                                <div className="appointment-content">
                                                    <div className="content-row01">
                                                        <FaUser className="customer-img" />
                                                        <div className="content-row01-description">
                                                            <strong>{app.customer}</strong>
                                                            <span>{app.itemStatus}</span>
                                                        </div>
                                                    </div>
                                                    <div className="appointment-catDetails">
                                                        <span>{app.itemCategory}</span>
                                                    </div>
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

export default TodayPlanner;