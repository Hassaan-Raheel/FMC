import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReScheduleModal.css";
import InputField from "../UI-Controls/InputField/InputField";
import CustomDropdown from "../UI-Controls/Dropdown/dropdown";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Url } from "../../Services/Api";

const EditAppointmentModal = ({ isOpen, onClose, appointment, fetchTableData }) => {

    const [updatedData, setUpdatedData] = useState({
        email: "",
        name: "",
        contact: "",
        type: "",
        storeName: "",
        status: "",
        date: "",
        time: "",
        category: "",
    });

    useEffect(() => {
        if (appointment) {
            setUpdatedData({
                email: appointment.details?.email || "",
                name: appointment.details?.firstName || "",
                contact: appointment.details?.contact || "",
                type: appointment.serviceType || "",
                storeName: appointment.selectedStore?.name || "",
                status: appointment.status || "",
                date: appointment.selectedDate || "",
                time: appointment.selectedSlot || "",
                category: appointment.selectedCategories?.[0]?.name || "",
            });
        }
    }, [appointment]);

    if (!isOpen || !appointment) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTypeChange = (selectedType) => {
        setUpdatedData((prevData) => ({
            ...prevData,
            type: selectedType,
        }));
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                appointmentId: appointment._id,
                status: updatedData.status,
                note: appointment.note || "",
                serviceType: updatedData.type,
                selectedDate: updatedData.date,
                selectedSlot: updatedData.time,
                selectedStore: {
                    ...appointment.selectedStore,
                    name: updatedData.storeName,
                },
                details: {
                    ...appointment.details,
                    firstName: updatedData.name,
                    contact: updatedData.contact,
                    email: updatedData.email,
                },
                selectedCategories: appointment.selectedCategories,
            };

            const response = await axios.put(
                `${Url}/api/v1/appointments/update-appointment/${appointment._id}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("Appointment Updated Successfully:", response.data);
            onClose();
            fetchTableData();
        } catch (error) {
            console.error("Error updating appointment:", error.response?.data || error.message);
        }
    };

    const statusTypeOptions = [
        { value: "pending", label: "Pending" },
        { value: "canceled", label: "Canceled" },
        { value: "booked", label: "Booked" },
        { value: "completed", label: "Completed" },
    ];

    return (
        <div className="modal-overlay">
            <div className="Edit-Modal-Container">
                <div className="header">
                    <span className="Schedule-Heading">Edit Appointment</span>
                    <div className="header-buttons">
                        <button className="save-btn" onClick={handleUpdate}>Update</button>
                        <button className="close-btn" onClick={onClose}>✖</button>
                    </div>
                </div>

                <div className="content">
                    <div className="LeftSide-Data">
                        <div className="Edit-modal-column-01">
                            <div className="Edit-modal-data">Email: </div>
                            <div className="Edit-modal-data">Name: </div>
                            <div className="Edit-modal-data">Contact: </div>
                            <div className="Edit-modal-data">Type: </div>
                            <div className="Edit-modal-data">Store Name: </div>
                            <div className="Edit-modal-data">Status: </div>
                        </div>
                        <div className="Edit-modal-column-02">
                            <InputField value={updatedData.email} name="email" readOnly width={"115%"} height={30} />
                            <InputField value={updatedData.name} name="name" onChange={handleChange} width={"115%"} height={30} />
                            <InputField value={updatedData.contact} name="contact" onChange={handleChange} width={"115%"} height={30} />

                            <div className="modal-data-01">
                                <label className="LabelClass">
                                    <input type="radio" name="type" checked={updatedData.type === "in-store"} onChange={() => handleTypeChange("in-store")} />
                                    <span className="AppointmentType">In-Store</span>
                                </label>
                                <label className="LabelClass">
                                    <input type="radio" name="type" checked={updatedData.type === "online"} onChange={() => handleTypeChange("online")} />
                                    <span className="AppointmentType">Online</span>
                                </label>
                            </div>

                            <InputField value={updatedData.storeName} name="storeName" onChange={handleChange} width={"115%"} height={30} />

                            <CustomDropdown
                                options={statusTypeOptions}
                                selectedOption={updatedData.status}
                                handleOptionChange={(value) =>
                                    setUpdatedData((prevData) => ({ ...prevData, status: value }))
                                }
                                dropdownWidth={195}
                                dropdownHeight={36}
                                optionsWidth={193}
                                arrowSize={17}
                                dropdownSelectedStyle="6px 8px"
                            />
                        </div>
                    </div>

                    <div className="RightSide-Data">
                        <div className="Edit-modal-column-03">
                            <div className="modal-data">Date:</div>
                            <div className="modal-data">Time:</div>
                            <div className="modal-data">Category:</div>
                        </div>
                        <div className="Edit-modal-column-02">

                            <DatePicker
                                name="date"
                                value={updatedData.date ? dayjs(updatedData.date) : null}
                                onChange={(date, dateString) => handleChange({ target: { name: "date", value: dateString } })}
                                style={{ width: "97%" }}
                                getPopupContainer={(trigger) => trigger.parentNode}
                            />

                            <InputField value={updatedData.time} name="time" onChange={handleChange} width={"100%"} height={30} />

                            <InputField value={updatedData.category} name="category" readOnly width={"100%"} height={30} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAppointmentModal;