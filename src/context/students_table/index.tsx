import React, { createContext, useReducer, useMemo } from "react";
import { DateTime } from "luxon";
import { TStudents } from "../../types";

type TState = {
  students: TStudents;
  page: number;
  rowsPerPage: number;
  filter: string;
  datePickerValue: DateTime | string;
};

const INITIAL_STATE: TState = {
  students: {},
  page: 0,
  rowsPerPage: 5,
  filter: "",
  datePickerValue: "2015-03-02",
};

interface IStudentsContext {
  state: TState;
  setState: (state: Partial<TState>) => void;
}

export const StudentsContext = createContext<IStudentsContext>(
  {} as IStudentsContext
);

export const StudentsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useReducer(
    (state: TState, newState: Partial<TState>): TState => ({
      ...state,
      ...newState,
    }),
    INITIAL_STATE
  );

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [state, setState]
  );

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};
