import { TStudentProps } from "../types";

export const createData = (
  name: string,
  domain: string,
  history: TStudentProps
) => {
  return {
    name,
    domain,
    history,
  };
};
