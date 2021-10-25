import {useMemo, useState, useEffect} from 'react';
import axios from "axios";
import {useMonthDatesArray} from "./useMonthDatesArray";

export const useData = () => {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState([]);

  // Запрос данных из БД
  useEffect(() => {
    axios.get('http://localhost:3001/db.json')
      .then(({data}) => {
        setData(data.data);
        setLoading(false);
      });
  }, []);

  // Получение дней в месяце для отрисовки в таблице
  const tableDays = useMonthDatesArray(data);
  // Приводим данные полученные из БД в нужный нам вид
  const preparedData = useMemo(() => (data.map((user) => {
    user.totalSpent = 0;
    user.normalizedTimeSpent = tableDays.map((date) => {
      const day = user.Days.find((day) => {
        return (new Date(day.Date)).getDate() === date;
      });
      if ( !day) {
        return {timeSpent: 0, date};
      }
      const start = day.Start.replace("-", ":");
      const end = day.End.replace("-", ":");

      const timeEnd = new Date(`${day.Date} ${end}`);
      const timeStart = new Date(`${day.Date} ${start}`);
      const diff = timeEnd - timeStart;

      const timeSpent = Math.floor(diff / (1000 * 60));
      user.totalSpent += timeSpent;
      return {timeSpent, date};
    });
    // console.log(user);
    return user;
  })), [ data, tableDays ]);
  return useMemo(() => ({
    loading,
    preparedData,
    tableDays,
  }), [ loading, preparedData, tableDays ]);
};