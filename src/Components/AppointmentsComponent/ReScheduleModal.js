import React, { useState } from "react";
import "./ReScheduleModal.css";
import EditAppointmentModal from "./EditScheduleModal";

const RescheduleModal = ({ isOpen, onClose, appointment, setIsModalOpen, fetchTableData }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);

    if (!isOpen || !appointment) return null;

    const handleClose = () => {
        setIsEditOpen(false);
        setIsModalOpen(false);
    };

    return (
        <div className="modal-overlay">
            {!isEditOpen && (
            <div className="modal-container">
                <div className="header">
                    <span className="Schedule-Heading">Appointment</span>
                    <div className="header-buttons">
                        <button className="edit-btn" onClick={() => setIsEditOpen(true)}>Edit</button>
                        <button className="close-btn" onClick={onClose}>✖</button>
                    </div>
                </div>

                <div className="content">
                    <div className="LeftSide-Data">
                        <div className="modal-column-01">
                            <div className="modal-data">Email: </div>
                            <div className="modal-data">Name: </div>
                            <div className="modal-data">Contact: </div>
                            <div className="modal-data">Type: </div>
                            <div className="modal-data">Store Name: </div>
                            <div className="modal-data">Status: </div>
                        </div>
                        <div className="modal-column-02">
                            <div className="modal-data-01">{appointment.details.email}</div>
                            <div className="modal-data-01">{appointment.details.firstName}</div>
                            <div className="modal-data-01">{appointment.details.contact}</div>
                            <div className="modal-data-01">{appointment.serviceType}</div>
                            <div className="modal-data-01">{appointment.selectedStore.name}</div>
                            <div className="modal-data-01">{appointment.status}</div>
                        </div>
                    </div>

                    <div className="RightSide-Data">
                        <div className="modal-column-01">
                            <div className="modal-data">Date:</div>
                            <div className="modal-data">Time:</div>
                            <div className="modal-data">Category:</div>
                        </div>
                        <div className="modal-column-02">
                            <div className="modal-data-01">{appointment.selectedDate}</div>
                            <div className="modal-data-01">{appointment.selectedSlot}</div>
                            <div className="modal-data-01">{appointment.selectedCategories[0].name}</div>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {isEditOpen && (
                <EditAppointmentModal
                    isOpen={isEditOpen}
                    onClose={handleClose}
                    appointment={appointment}
                    fetchTableData={fetchTableData}
                />
            )}
        </div>
    );
};

export default RescheduleModal;