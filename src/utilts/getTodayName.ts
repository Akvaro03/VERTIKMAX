function getTodayName() {
  const todayEs = new Intl.DateTimeFormat("es-AR", { weekday: "long" })
    .format(new Date())
    .toLowerCase(); // "lunes", "martes", etc.
  return todayEs;
}

export default getTodayName;
