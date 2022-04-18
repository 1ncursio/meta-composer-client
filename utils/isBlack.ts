const isBlack = (noteNumber: number) => {
  return (
    (noteNumber + 11) % 12 === 0 ||
    (noteNumber + 8) % 12 === 0 ||
    (noteNumber + 6) % 12 === 0 ||
    (noteNumber + 3) % 12 === 0 ||
    (noteNumber + 1) % 12 === 0
  );
};

export default isBlack;
