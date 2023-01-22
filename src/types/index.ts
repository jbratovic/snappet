export type TStudentProps = {
  SubmittedAnswerId: number;
  SubmitDateTime: string;
  Correct: number;
  Progress: number;
  UserId: number;
  ExerciseId: number;
  Difficulty: string;
  Subject: string;
  Domain: string;
  LearningObjective: string;
};

export type TDataTable = {
  name: string;
  domain: string;
  history: TStudentProps;
};

export type TChart = {
  name: string;
  progress: number;
};

export enum ESortCategory {
  highest = "highest",
  lowest = "lowest",
}
