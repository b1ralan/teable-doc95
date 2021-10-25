import React, {useState} from "react";
import {DateSpent} from "./components/DateSpent";
import {useData} from "./Hooks/useData";
import ScrollContainer from 'react-indiana-drag-scroll';

import style from './styles.module.css';
import {useSortableData} from "./Hooks/useSortableData";
import Weather from "./components/Weather/Weather";
import Pagination from "./components/Pagination";
import Loader from "./components/Loader/Loader";


function App() {
  const [ modalActive, setModalActive ] = useState(false);
  const {preparedData, tableDays, loading} = useData();
  const {sortData, requestSort, sortConfig} = useSortableData(preparedData);

  const [ search, setSearch ] = useState('');

  const [ pageSize ] = useState(10);
  const [ page, setPage ] = useState(1);

  // Устанавливаем первый и последний индекс для отображение записей в таблице по странично
  const firstPageIndex = (page - 1) * pageSize;
  const lastPageIndex = page * pageSize;

  // Фильтрация таблицы по имени пользователя
  const filterData = sortData.filter((user) => {
    if (search === "") {
      return true;
    }
    if (user.Fullname.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }
    return false;
  });

  // Вывод отфильтрованных данных по странично
  const pageData = filterData.slice(firstPageIndex, lastPageIndex);

  return (
    <>
      {
        loading ? <Loader/>
          :
          <div className={style.container}>
            <Weather active={modalActive} setActive={setModalActive}/>
            <div className={style.searchBlock}>
              <label className="">
                Введите пользователя
                <input
                  className="input"
                  type="text"
                  placeholder="User Name..."
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
              </label>
            </div>
            <div className={style.tableContainer}>
              <ScrollContainer ignoreElements="span">
                <table className={style.table}>
                  <thead>
                  <tr>
                    <th
                      onClick={() => requestSort('Fullname')}
                      className={modalActive === true ? null : style.stickyLeft}
                    >User {sortConfig && sortConfig.key === 'Fullname' ?
                      <small>{`(${sortConfig.direction})`}</small> : null}
                    </th>
                    {tableDays.map(day => <th
                      onClick={() => setModalActive(true)}
                      key={day}>{day}</th>)}
                    <th
                      onClick={() => requestSort('totalSpent')}
                      className={modalActive === true ? null : style.stickyRight}
                    >Monthly total {sortConfig && sortConfig.key === 'totalSpent' ?
                      <small>{`(${sortConfig.direction})`}</small> : null}
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {pageData.map((item) => (
                    <tr key={item.id}>
                      <th className={modalActive === true ? null : style.stickyLeft}><span>{item.Fullname}</span></th>
                      {item.normalizedTimeSpent.map(({timeSpent, date}) => {
                        return (
                          <td className={style.colm} key={date}><span><DateSpent minutes={timeSpent}/></span></td>
                        );
                      })}
                      <th className={modalActive === true ? null : style.stickyRight}><span><DateSpent
                        minutes={item.totalSpent}/></span>
                      </th>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </ScrollContainer>
            </div>
            <Pagination filterData={filterData} page={page} setPage={setPage} pageSize={pageSize}/>
          </div>
      }
    </>
  );
}

export default App;
