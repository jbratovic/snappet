import { TStudents, TStudentProps, ESortCategory } from "../types";

export const sortStudents = (
  students: TStudents,
  sortCategory: ESortCategory
) => {
  const sortedStudents: TStudents = {};
  for (const [key, value] of Object.entries(students)) {
    let sortByHighProgress: TStudentProps[] = [];
    if (sortCategory === ESortCategory.highest) {
      sortByHighProgress = value.sort((a, b) =>
        Math.round(a.Progress) < Math.round(b.Progress) ? 1 : -1
      );
    } else if (sortCategory === ESortCategory.lowest) {
      sortByHighProgress = value.sort((a, b) =>
        Math.round(a.Progress) > Math.round(b.Progress) ? 1 : -1
      );
    }

    sortedStudents[key as any] = sortByHighProgress;
  }
  return sortedStudents;
};
