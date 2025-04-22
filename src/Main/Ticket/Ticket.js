import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Ticket.css";

function Ticket() {
    const location = useLocation();
    const ticketData = useMemo(() => location.state || {}, [location.state]);
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10); // Начальный отсчёт
    const [isRedirecting, setIsRedirecting] = useState(false); // Флаг, когда пора перенаправить
    const { branchId } = useParams();
    // Запуск отсчёта
    useEffect(() => {
        if (countdown === 0) {
            setIsRedirecting(true); // Когда отсчёт заканчивается
            navigate(`/branch/${branchId}/`); // Переход на главный экран
        }

        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            // Очистка таймера при размонтировании компонента
            return () => clearInterval(timer);
        }
    }, [countdown, branchId, navigate]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div className="ticket-container">
                <div className="ticket-card">
                    <h3>
                        <span style={{ color: "green", fontSize: 30 }}>&#10003;</span>
                        {i18n.language === "ru" ? " Вы записаны" : " Шумо ба қайд гирифта шудед"}
                    </h3>
                    <h2 className="ticket-title">
                        {i18n.language === "ru" ? "Ваш номер талона" : "Рақами талони шумо "}
                    </h2>

                    <div className="ticket-content">
                        <p className="ticket-number">{ticketData.ticketNo}</p>
                        <p className="ticket-service">{ticketData.serviceName}</p>

                        <div className="ticket-details">
                            <span>{i18n.language === "ru" ? "Начало" : "Оғоз"}:</span>
                            {new Date(parseInt(ticketData.startTime)).toLocaleTimeString()}
                        </div>
                        <h2 className="ticket-title">
                            {i18n.language === "ru" ? "Пожалуйста, ожидайте вызова" : "Лутфан, даъватро интизор шавед"}
                        </h2>
                        <p className="ticket-service">
                            {i18n.language === "ru" ? "Возврат на главный экран" : "Бозгашт ба экрани асосӣ"}
                        </p>

                        {/* Отображение отсчёта */}
                        {!isRedirecting && (
                            <p className="countdown">
                                {i18n.language === "ru" ? `Ожидание: ${countdown}` : `Интизорӣ: ${countdown}`}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticket;
