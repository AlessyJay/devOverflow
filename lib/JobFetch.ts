import { useState, useEffect } from "react";

const useFetch = (endpoint: string, query: string[]) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const url = `https://jsearch.p.rapidapi.com/${endpoint}`;

  const options = {
    mothod: "GET",
    headers: {
      "x-rapidapi-key": process.env.API_KEY,
      "x-rapidapi-host": process.env.API_HOST,
    },
    params: { ...query, page: 1, num_pages: 1 },
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
};
