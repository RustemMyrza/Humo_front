export default async function getSMSTicket({ ticketNum, phoneNum }) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/request/get-ticket-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketNum, phoneNum }), // Упрощенная передача объекта
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Ошибка запроса:", error);
      return null; // Возвращаем null в случае ошибки
    }
  }
  