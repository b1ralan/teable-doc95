export const DateSpent = ({minutes}) => {
  const hours = Math.floor(minutes / 60);
  return `${hours === 0 ? '' : `${hours} ч. `}${minutes - hours * 60} мин.`;
};
