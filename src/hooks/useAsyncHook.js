import { useEffect, useState } from 'react';

export function useAsyncHook() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch();
        const json = await response.json();

        // console.log(json);
        setData(json);
      } catch (error) {
        setIsLoading(false);
        //error handler
      }
    }

    fetchData();
  }, []);

  return { data, isLoading };
}
