import React, { useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "./Ticket.css";

function Ticket() {
    const location = useLocation();
    const ticketData = useMemo(() => location.state || {}, [location.state]);
    const { i18n } = useTranslation();

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div className="ticket-container">
                <div className="ticket-card">
                    <h3>
                        <span style={{ color: "green", fontSize: 30 }}>&#10003;</span>
                        {i18n.language === "ru" ? " Вы записаны" : " Сіз жазылдыңыз"}
                    </h3>
                    <h2 className="ticket-title">
                        {i18n.language === "ru" ? "Ваш номер талона" : "Сіздің талоныңыз"}
                    </h2>
    
                    <div className="ticket-content">
                        <p className="ticket-number">{ticketData.ticketNo}</p>
                        <p className="ticket-service">{ticketData.serviceName}</p>
    
                        <div className="ticket-details">
                            <span>{i18n.language === "ru" ? "Начало" : "Басталу"}:</span>
                            {new Date(parseInt(ticketData.startTime)).toLocaleTimeString()}
                        </div>
                        <h2 className="ticket-title">
                            {i18n.language === "ru" ? "Пожалуйста, ожидайте вызова" : "Қоңырау күтіңіз."}
                        </h2>
                        <p className="ticket-service">
                            {i18n.language === "ru" ? "Возврат на главный экран" : "Басты экранға оралу"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default Ticket;
