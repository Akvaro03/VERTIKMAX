import { Weekday } from "@/generated/prisma/enums";

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getTodayName() {
  const todayEs = new Intl.DateTimeFormat("es-AR", { weekday: "long" })
    .format(new Date())
    .toLowerCase(); // "miércoles", etc.

  const noAccent = stripAccents(todayEs); // "miercoles"
  return noAccent as Weekday;
}

export default getTodayName;
