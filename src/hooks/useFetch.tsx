import React, { useState, useEffect } from "react";

type TFetchData = {
  api: any;
  method: string;
  url: string;
  data?: null;
  config?: number;
};

export const useFetch = ({ api, method, url, data, config }: TFetchData) => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: false,
  });

  useEffect(() => {
    setState({ loading: true, data: null, error: false });

    (async () => {
      try {
        const responseData = await api[method.toLowerCase()](url, config, data);

        setState({ loading: false, data: responseData, error: false });
      } catch (error: any) {
        setState({ loading: false, data: null, error: error?.message });
      }
    })();
  }, [api, method, url, data, config]);

  return state;
};
