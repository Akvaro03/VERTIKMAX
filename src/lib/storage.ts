export interface Exercise {
  id: string;
  name: string;
  category: string;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  feeling: "easy" | "moderate" | "hard" | "very-hard";
  notes: string;
  date: string;
}

export interface TrainingDay {
  id: string;
  name: string;
  exercises: string[]; // Array of exercise IDs
  createdAt: string;
  day:
    | "lunes"
    | "martes"
    | "miércoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";
}

export const getExercises = (): Exercise[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("exercises");
  return data ? JSON.parse(data) : [];
};

export const saveExercises = (exercises: Exercise[]) => {
  localStorage.setItem("exercises", JSON.stringify(exercises));
};

export const addExercise = (exercise: Omit<Exercise, "id" | "createdAt">) => {
  const exercises = getExercises();
  const newExercise: Exercise = {
    ...exercise,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  exercises.push(newExercise);
  saveExercises(exercises);
  return newExercise;
};

export const updateExercise = (id: string, updates: Partial<Exercise>) => {
  const exercises = getExercises();
  const index = exercises.findIndex((e) => e.id === id);
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...updates };
    saveExercises(exercises);
  }
};

export const deleteExercise = (id: string) => {
  const exercises = getExercises().filter((e) => e.id !== id);
  saveExercises(exercises);
  // Also delete related logs
  const logs = getWorkoutLogs().filter((log) => log.exerciseId !== id);
  saveWorkoutLogs(logs);
};

export const getWorkoutLogs = (): WorkoutLog[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("workoutLogs");
  return data ? JSON.parse(data) : [];
};

export const saveWorkoutLogs = (logs: WorkoutLog[]) => {
  localStorage.setItem("workoutLogs", JSON.stringify(logs));
};

export const addWorkoutLog = (log: Omit<WorkoutLog, "id" | "date">) => {
  const logs = getWorkoutLogs();
  const newLog: WorkoutLog = {
    ...log,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  logs.push(newLog);
  saveWorkoutLogs(logs);
  return newLog;
};

export const getTrainingDays = (): TrainingDay[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("trainingDays");
  return data ? JSON.parse(data) : [];
};

export const saveTrainingDays = (days: TrainingDay[]) => {
  localStorage.setItem("trainingDays", JSON.stringify(days));
};

export const addTrainingDay = (day: Omit<TrainingDay, "id" | "createdAt">) => {
  const days = getTrainingDays();
  const newDay: TrainingDay = {
    ...day,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  days.push(newDay);
  saveTrainingDays(days);
  return newDay;
};

export const updateTrainingDay = (
  id: string,
  updates: Partial<TrainingDay>
) => {
  const days = getTrainingDays();
  const index = days.findIndex((d) => d.id === id);
  if (index !== -1) {
    days[index] = { ...days[index], ...updates };
    saveTrainingDays(days);
  }
};

export const deleteTrainingDay = (id: string) => {
  const days = getTrainingDays().filter((d) => d.id !== id);
  saveTrainingDays(days);
};

export const getLogsByExercise = (exerciseId: string): WorkoutLog[] => {
  return getWorkoutLogs()
    .filter((log) => log.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
