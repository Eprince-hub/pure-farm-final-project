import db from './db';

// this error message is being used by enqueueSnackbar from notistack in placeorder file
const getError = (err) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message // error message from the backend API
    : err.message; // common error message in the error

// This error message is being used by the API that creates the order in the database
// and would handle any error that would occur during the creation of the order.

const onError = async (err, req, res, next) => {
  await db.disconnect();

  res.status(500).send({ message: err.toString() });
}; // an Express js error handler
export { getError, onError };