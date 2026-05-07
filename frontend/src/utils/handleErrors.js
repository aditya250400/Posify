export const handleErrors = (errorResponse, setErrors) => {
  const errorMessage = {};
  errorResponse.errors.forEach((error) => {
    errorMessage[error.path] = error.msg;
  });

  setErrors(errorMessage);
};
