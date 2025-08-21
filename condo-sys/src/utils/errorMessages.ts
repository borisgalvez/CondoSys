export const errorMessageFormat = (err: any) => {
  const errors = err.response.data;
  const errorMessages = Object.entries(errors).flatMap(([field, messages]) =>
    Array.isArray(messages)
      ? messages.map((msg) => `${field}: ${msg}`)
      : [`${field}: ${messages}`]
  );
	return errorMessages
};
