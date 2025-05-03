
// --------* A generic & structured response for all APIs *--------

const success = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      isError: false,
      message,
      data,
    });
  };
  
  const error = (res, message, statusCode = 400, data = null) => {
    return res.status(statusCode).json({
      isError: true,
      message,
      data,
    });
  };
  
  module.exports = { success, error };
  