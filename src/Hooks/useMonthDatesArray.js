import {useMemo} from "react";

export const useMonthDatesArray = (data) => {
  // Получаем информацию о месяце и выводим количество дней в нём
  return useMemo(() => {
    if ( !data.length) {
      return [];
    }
    const dateString = data[0].Days[0].Date;
    const currentDate = dateString.split("-");
    const dayInMonth = new Date(+currentDate[0], +currentDate[1], 0).getDate();
    return new Array(dayInMonth).fill(null).map((v, index) => index + 1);
  }, [ data ]);
};
