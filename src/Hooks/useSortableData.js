import React from 'react';

export const useSortableData = (sortData, config = null) => {
  const [ sortConfig, setSortConfig ] = React.useState(config);

  //Сортировка таблицы
  const sortedItems = React.useMemo(() => {
    let sortableItems = [ ...sortData ];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [ sortData, sortConfig ]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({key, direction});
  };

  return {sortData: sortedItems, requestSort, sortConfig};
};
