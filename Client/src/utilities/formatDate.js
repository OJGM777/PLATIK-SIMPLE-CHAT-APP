export const formatDate = (isoString, isOnlyHour) => {
  const date = new Date(isoString);
  if(isOnlyHour){
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Usa formato de 12 horas. Cambia a `false` para formato de 24 horas.
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
