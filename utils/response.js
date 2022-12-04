const response = (data, isError) => {
  let error;
  isError ? (error = true) : (error = false);
  return {
    error,
    status: isError ? "01" : "00",
    data,
  };
};

module.exports = { response };
