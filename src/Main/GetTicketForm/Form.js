import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./TicketForm.css";

export default function Form() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Удаляем все нецифровые символы перед валидацией
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!validatePhone(cleanPhone)) {
      setError(t("error.phone"));
      return;
    }

    localStorage.setItem("phone", cleanPhone);
    localStorage.setItem("ticketTimestamp", Date.now());

    navigate("service/1005");
  };

  function validatePhone(phone) {
    return /^992\d{9}$/.test(phone);
  }

  // Функция для форматирования номера телефона
  const formatPhoneNumber = (value) => {
    if (!value) return "";
    
    // Удаляем все нецифровые символы
    const cleanValue = value.replace(/\D/g, '');
    
    // Ограничиваем длину (992 + 9 цифр)
    const limitedValue = cleanValue.substring(0, 12);
    
    // Форматируем номер
    let formattedValue = "+ 992";
    
    if (limitedValue.length > 3) {
      formattedValue += "-" + limitedValue.substring(3, 5);
    }
    if (limitedValue.length > 5) {
      formattedValue += "-" + limitedValue.substring(5, 8);
    }
    if (limitedValue.length > 8) {
      formattedValue += "-" + limitedValue.substring(8, 10);
    }
    if (limitedValue.length > 10) {
      formattedValue += "-" + limitedValue.substring(10, 12);
    }
    
    return formattedValue;
  };

  return (
    <div className="ticket-form">
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="phone"
          value={formatPhoneNumber(phone)}
          onChange={(e) => {
            // Удаляем все нецифровые символы
            const cleanValue = e.target.value.replace(/\D/g, '');
            
            // Ограничиваем длину (992 + 9 цифр)
            const limitedValue = cleanValue.substring(0, 12);
            
            // Устанавливаем неформатированное значение в state
            setPhone(limitedValue);
          }}
          onFocus={(e) => {
            // При фокусе, если поле пустое, устанавливаем начало номера
            if (!phone) {
              setPhone("992");
            }
          }}
          placeholder={t("form.phone_placeholder")}
        />
        {error && <p className="error">{error}</p>}
        <button className="form-button" type="submit">
          {t("form.continue")}
        </button>
      </form>
    </div>
  );
}
