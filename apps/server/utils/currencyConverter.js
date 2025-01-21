const UNQ_RATE = 0.003725;

export const usdToUnq = (usdAmount) => {
  return Math.ceil(usdAmount / UNQ_RATE);
};

export const unqToUsd = (unqAmount) => {
  return (unqAmount * UNQ_RATE).toFixed(2);
};
