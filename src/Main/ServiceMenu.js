import React, { useState, useEffect } from 'react';
import ServiceType from './ServiceType.js';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "../locales/en/translation.json";
import translationRU from "../locales/ru/translation.json";
import translationTJ from "../locales/tj/translation.json";
import { useParams, useNavigate } from "react-router";
import './button.css';
import './MainContent.css';
import GetTicketRequest from './Ticket/RequestForGetTicket.js';
import GetTicketSMS from './Ticket/RequestForGetSMS.js';
import Ticket from './Ticket/Ticket.js';


const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  tj: {
    translation: translationTJ,
  },
};

i18n
  .use(LanguageDetector) // Подключаем автоопределение языка
  .use(initReactI18next) // Инициализируем react-i18next
  .init({
    resources,
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // Откуда определять язык
      caches: ["localStorage", "cookie"], // Где сохранять
    },
  });

  function getParentName(serviceTree, serviceId, propertyId, lang = 'ru') {
    for (const service of serviceTree) {
      // eslint-disable-next-line eqeqeq
      if (service[propertyId] == Number(serviceId)) {  // ✅ Доступ через []
        // eslint-disable-next-line default-case
        switch (lang) {
          case 'ru':
            return service.name_ru;
          case 'tj':
            return service.name_tj;
        }
      }
  
      if (service.children.length > 0) {
        const result = getParentName(service.children, serviceId, propertyId, lang);
        if (result) return result; // Прерываем выполнение, если нашли нужное значение
      }
    }
  
    return null; // Если не найдено, возвращаем null
  }
  
  

function MainContent() {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]); // Состояние для хранения данных
    // const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true); // Состояние для индикатора загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок
    const [ticketData, setTicketData] = useState(null);
    const { branchId, serviceId } = useParams();
    const navigate = useNavigate();
    const [visibleServices, setVisibleServices] = useState(services);
    const iin = localStorage.getItem('iin');
    const phoneNum = localStorage.getItem('phone');
    const lang = localStorage.getItem('i18nextLng');
    let serviceName = null;
    // let branchName = null;

    if (serviceId !== Number(process.env.REACT_APP_BASE_SERVICE)) {
      serviceName = getParentName(services, serviceId, 'queueId', i18n.language);
    }

    // if (branchId) {
    //   branchName = getParentName(branches, branchId, 'branchId', i18n.language);
    // }

    useEffect(() => {
      fetch(`${process.env.REACT_APP_BACK_URL}/api/web-service/list`)
        .then(response => response.json())
        .then(data => {
          setServices(data); // Сохраняем данные в состоянии
          setLoading(false); // Загрузка завершена
        })
        .catch(err => {
          setError(`Ошибка загрузки данных: ${err}`);
          setLoading(false); // Завершаем загрузку в случае ошибки
        });
    }, []);

    useEffect(() => {
      fetch(`${process.env.REACT_APP_BACK_URL}/api/branch/list`)
        .then(response => response.json())
        .then(data => {
          // setBranches(data); // Сохраняем данные в состоянии
          setLoading(false); // Загрузка завершена
        })
        .catch(err => {
          setError(`Ошибка загрузки данных: ${err}`);
          setLoading(false); // Завершаем загрузку в случае ошибки
        });
    }, []);

    useEffect(() => {
      setVisibleServices([]);
    
      if (!services.length) return;
    
      const findById = (nodes, id) => {
        for (const node of nodes) {
          if (node.queueId === id) return node;
          if (node.children.length > 0) {
            const found = findById(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };
    
      const parentService = findById(services, Number(serviceId));
      if (parentService) {
        if (!parentService.children || parentService.children.length === 0) {
          (async () => {
            try {
              const data = await GetTicketRequest({
                queueId: serviceId,
                iin,
                phoneNum,
                branchId,
                local: lang
              });
  
              if (!data || data.status === "false") { // Проверяем статус ответа
                throw new Error(data?.message || "Нет нужного оператора");
              }
  
              console.log("Полученные данные:", data);
              const ticketNum = data.ticketNo;
              console.log('Номер талона:', ticketNum)
              const smsTicketStatus = await GetTicketSMS({
                ticketNum,
                phoneNum
              })

              if (!smsTicketStatus || smsTicketStatus.status === "false") { // Проверяем статус ответа
                throw new Error(smsTicketStatus?.message || "Ошибка при отправке смс");
              }

              setTicketData(data);
            } catch (error) {
              console.error("Ошибка запроса:", error);
              alert(`Ошибка: ${error.message}`); // Выводим alert с ошибкой
              navigate(-1);
            }
          })();
        } else {
          setVisibleServices(parentService.children);
        }
      } else if (serviceId === undefined) {
        setVisibleServices(services);
      }
    }, [serviceId, services, branchId, iin, lang, phoneNum, navigate]); // ✅ Добавляем navigate
    
    useEffect(() => {
      if (ticketData) {
        console.log("ticketData перед navigate:", ticketData);
        if (ticketData?.eventId) {
          navigate(`/branch/${branchId}/ticket/${ticketData.eventId}`, {
            state: ticketData
          });
        }
      }
    }, [ticketData, branchId, navigate]); // ✅ Ждем, пока ticketData загрузится
    
    

    if (loading) {
      return <div>Загрузка...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

    const serviceListStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }

    return (
        <div className='main'>
            <main>
            <h2 className='main-title'>{ serviceId !== process.env.REACT_APP_BASE_SERVICE ? serviceName : t("mainTitleInstruction") }</h2>
                {/* <h4 className='branch-title'>{ branchName ? branchName : 'Филиал не найден' }</h4> */}
                {serviceId !== process.env.REACT_APP_BASE_SERVICE && (
                  <button
                    onClick={() => navigate(-1)}
                    className="go-back">
                    <span>{ i18n.language === 'ru' ? 'Назад' : 'Бозгашт' }</span>
                  </button>
                )}
                <div className='service-types-list' style={serviceListStyle}>
                { visibleServices.length > 0 ? visibleServices.map((service) => (
                  <ServiceType
                    serviceText={ i18n.language === 'ru' ? service.name_ru : service.name_tj}
                    queueId={service.queueId} // Данные с API
                    serviceId={service.parentId}
                    link={`/branch/${branchId}/service/${service.queueId}`}
                  />
                )) : 
                <Ticket
                ticketData={ticketData}
                /> }
                </div>
            </main>
        </div>
    )
}


export default MainContent;