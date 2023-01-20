export const getBaseAPIUrl = () => {
  switch (process.env.REACT_APP_ENV_MODE) {
    case "dev":
      return "https://raw.githubusercontent.com/";

    default:
      return "https://raw.githubusercontent.com/";
  }
};
